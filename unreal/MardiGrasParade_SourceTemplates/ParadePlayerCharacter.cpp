// ParadePlayerCharacter.cpp
// Mardi Gras Parade Game - Player Character Implementation
// Place this in: Source/MardiGrasParade/Characters/ParadePlayerCharacter.cpp

#include "ParadePlayerCharacter.h"
#include "Camera/CameraComponent.h"
#include "GameFramework/SpringArmComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "Kismet/GameplayStatics.h"
#include "DrawDebugHelpers.h"
#include "TimerManager.h"

AParadePlayerCharacter::AParadePlayerCharacter()
{
    PrimaryActorTick.bCanEverTick = true;

    // Set default character movement values
    GetCharacterMovement()->MaxWalkSpeed = BaseMoveSpeed;
    GetCharacterMovement()->RotationRate = FRotator(0.0f, RotationSpeed * 50.0f, 0.0f);
    GetCharacterMovement()->bOrientRotationToMovement = true;
    
    // Don't rotate when the controller rotates
    bUseControllerRotationPitch = false;
    bUseControllerRotationYaw = false;
    bUseControllerRotationRoll = false;

    // Create camera boom (spring arm)
    USpringArmComponent* CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraBoom"));
    CameraBoom->SetupAttachment(RootComponent);
    CameraBoom->TargetArmLength = 400.0f;
    CameraBoom->bUsePawnControlRotation = true;
    CameraBoom->SocketOffset = FVector(0.0f, 0.0f, 60.0f);

    // Create follow camera
    UCameraComponent* FollowCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FollowCamera"));
    FollowCamera->SetupAttachment(CameraBoom, USpringArmComponent::SocketName);
    FollowCamera->bUsePawnControlRotation = false;
    
 // Randomly assign player color (will be reassigned in game mode on game start)
    PlayerColor = static_cast<ECollectibleColor>(FMath::RandRange(0, 2));
}

void AParadePlayerCharacter::BeginPlay()
{
    Super::BeginPlay();

    // Add Input Mapping Context
    if (APlayerController* PlayerController = Cast<APlayerController>(Controller))
    {
        if (UEnhancedInputLocalPlayerSubsystem* Subsystem = 
     ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(PlayerController->GetLocalPlayer()))
    {
            Subsystem->AddMappingContext(DefaultMappingContext, 0);
     }
    }

    // Initialize movement speed
    UpdateMovementSpeed();
    
    // Log initialization
    UE_LOG(LogTemp, Log, TEXT("Player Character initialized with color: %d"), static_cast<int32>(PlayerColor));
}

void AParadePlayerCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);

    // Set up action bindings
    if (UEnhancedInputComponent* EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
    {
   // Moving
        if (MoveAction)
     {
    EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &AParadePlayerCharacter::Move);
        }
  
    // Looking
        if (LookAction)
   {
    EnhancedInputComponent->BindAction(LookAction, ETriggerEvent::Triggered, this, &AParadePlayerCharacter::Look);
        }
        
        // Click to move
        if (ClickMoveAction)
        {
 EnhancedInputComponent->BindAction(ClickMoveAction, ETriggerEvent::Started, this, &AParadePlayerCharacter::ClickToMove);
        }
    }
}

void AParadePlayerCharacter::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    // Move toward mouse target if set
    if (bHasMouseTarget)
    {
     MoveToTarget(DeltaTime);
    }
}

// ==========================================
// INPUT HANDLING
// ==========================================

void AParadePlayerCharacter::Move(const FInputActionValue& Value)
{
    // Clear mouse target when using keyboard
    if (bHasMouseTarget)
    {
        ClearMoveTarget();
    }

    // Input is a Vector2D
    FVector2D MovementVector = Value.Get<FVector2D>();

    if (Controller != nullptr)
    {
    // Find out which way is forward
        const FRotator Rotation = Controller->GetControlRotation();
        const FRotator YawRotation(0, Rotation.Yaw, 0);

        // Get forward vector
     const FVector ForwardDirection = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::X);
    
        // Get right vector 
     const FVector RightDirection = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::Y);

     // Add movement 
      AddMovementInput(ForwardDirection, MovementVector.Y);
   AddMovementInput(RightDirection, MovementVector.X);
    }
}

void AParadePlayerCharacter::Look(const FInputActionValue& Value)
{
    // Input is a Vector2D
    FVector2D LookAxisVector = Value.Get<FVector2D>();

    if (Controller != nullptr)
    {
 // Add yaw and pitch input to controller
   AddControllerYawInput(LookAxisVector.X);
   AddControllerPitchInput(LookAxisVector.Y);
    }
}

void AParadePlayerCharacter::ClickToMove(const FInputActionValue& Value)
{
    if (APlayerController* PlayerController = Cast<APlayerController>(Controller))
    {
        FHitResult HitResult;
        PlayerController->GetHitResultUnderCursor(ECC_Visibility, false, HitResult);
      
        if (HitResult.bBlockingHit)
    {
       SetMoveTarget(HitResult.Location);
            
  // Visual feedback (optional - implement in Blueprint!)
            OnCollectibleCaught(nullptr, 0); // Reuse event for feedback
       
UE_LOG(LogTemp, Log, TEXT("Click-to-move target set: %s"), *HitResult.Location.ToString());
}
    }
}

// ==========================================
// MOVEMENT FUNCTIONS
// ==========================================

void AParadePlayerCharacter::SetMoveTarget(FVector TargetLocation)
{
    // Constrain to street bounds (adjust these values based on your level)
    TargetLocation.X = FMath::Clamp(TargetLocation.X, -650.0f, 650.0f);
    TargetLocation.Z = GetActorLocation().Z; // Keep same height
    
    MouseTargetLocation = TargetLocation;
    bHasMouseTarget = true;
    
    // Draw debug sphere (only in editor)
    #if WITH_EDITOR
    DrawDebugSphere(GetWorld(), TargetLocation, 50.0f, 12, FColor::Green, false, 1.0f);
    #endif
}

void AParadePlayerCharacter::ClearMoveTarget()
{
    bHasMouseTarget = false;
 MouseTargetLocation = FVector::ZeroVector;
}

void AParadePlayerCharacter::MoveToTarget(float DeltaTime)
{
  FVector CurrentLocation = GetActorLocation();
    FVector Direction = MouseTargetLocation - CurrentLocation;
    Direction.Z = 0.0f; // Ignore vertical difference
    
    float Distance = Direction.Size();
    
    // Stop if we're close enough
    if (Distance < 50.0f)
    {
    ClearMoveTarget();
   return;
    }
    
    // Normalize direction and apply movement
    Direction.Normalize();
  AddMovementInput(Direction, 1.0f);
}

void AParadePlayerCharacter::UpdateMovementSpeed()
{
    float NewSpeed = BaseMoveSpeed;
    
    if (bSpeedBoostActive)
    {
        NewSpeed *= SpeedBoostMultiplier;
    }
    
    GetCharacterMovement()->MaxWalkSpeed = NewSpeed;
}

float AParadePlayerCharacter::GetCurrentMoveSpeed() const
{
    return GetCharacterMovement()->MaxWalkSpeed;
}

// ==========================================
// GAMEPLAY FUNCTIONS
// ==========================================

void AParadePlayerCharacter::CatchCollectible(ACollectible* Collectible)
{
    if (!Collectible)
    {
return;
    }
    
    // Get collectible properties (you'll implement ACollectible class separately)
    int32 PointValue = 1; // Default, will get from collectible
    bool bIsColorMatch = false; // Will check collectible color
    
    // Update combo
    float CurrentTime = GetWorld()->GetTimeSeconds();
    if (CurrentTime - LastCatchTime < ComboWindow && LastCatchTime > 0.0f)
    {
        Combo++;
        OnComboIncreased(Combo);
 }
    else
    {
        Combo = 1;
    }
    LastCatchTime = CurrentTime;
  
    // Update max combo
    if (Combo > MaxCombo)
    {
        MaxCombo = Combo;
    }
    
  // Calculate points (3x for color match)
    int32 PointsAwarded = bIsColorMatch ? PointValue * 3 : PointValue;
    
    // Add score
    AddScore(PointsAwarded);
    
    // Update stats
    TotalCatches++;
    
    // Award coins (1 per catch, bonus for combos)
  int32 CoinsAwarded = 1 + (Combo >= 3 ? FMath::FloorToInt(Combo / 3.0f) : 0);
    Coins += CoinsAwarded;
    
    // Play catch sound
    if (CatchSound)
    {
   UGameplayStatics::PlaySound2D(this, CatchSound, AudioVolume);
    }
    
  // Fire Blueprint event
    OnCollectibleCaught(Collectible, PointsAwarded);
    
    UE_LOG(LogTemp, Log, TEXT("Caught collectible! Points: %d, Combo: %d, Coins: %d"), 
  PointsAwarded, Combo, CoinsAwarded);
}

void AParadePlayerCharacter::AddScore(int32 Points)
{
    Score += Points;
}

void AParadePlayerCharacter::UpdateCombo()
{
    float CurrentTime = GetWorld()->GetTimeSeconds();
    
    // Break combo if window expired
    if (CurrentTime - LastCatchTime > ComboWindow && Combo > 0)
    {
        BreakCombo();
    }
}

void AParadePlayerCharacter::BreakCombo()
{
    if (Combo > 0)
    {
        UE_LOG(LogTemp, Warning, TEXT("Combo broken! Was at: %d"), Combo);
        Combo = 0;
        LastCatchTime = 0.0f;
    }
}

// ==========================================
// POWER-UP FUNCTIONS
// ==========================================

void AParadePlayerCharacter::ActivateSpeedBoost(float Duration)
{
    // Clear existing timer if active
    if (bSpeedBoostActive)
    {
      GetWorldTimerManager().ClearTimer(SpeedBoostTimerHandle);
    }
    
    bSpeedBoostActive = true;
    UpdateMovementSpeed();
    
    // Set timer to end boost
    GetWorldTimerManager().SetTimer(
     SpeedBoostTimerHandle,
    this,
        &AParadePlayerCharacter::OnSpeedBoostEnd,
        Duration,
     false
    );
    
    // Fire Blueprint event
    OnPowerUpActivated(TEXT("Speed Boost"));
    
    UE_LOG(LogTemp, Log, TEXT("Speed Boost activated for %.1f seconds! Speed: %.0f"), 
    Duration, GetCurrentMoveSpeed());
}

void AParadePlayerCharacter::OnSpeedBoostEnd()
{
    bSpeedBoostActive = false;
    UpdateMovementSpeed();
    
    UE_LOG(LogTemp, Log, TEXT("Speed Boost ended. Speed: %.0f"), GetCurrentMoveSpeed());
}
