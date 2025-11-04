// ParadePlayerCharacter.h
// Mardi Gras Parade Game - Player Character
// Place this in: Source/MardiGrasParade/Characters/ParadePlayerCharacter.h

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "InputActionValue.h"
#include "ParadePlayerCharacter.generated.h"

/**
 * Collectible color types - matches player color for 3x bonus!
 */
UENUM(BlueprintType)
enum class ECollectibleColor : uint8
{
    BeadsUMETA(DisplayName = "Beads (Purple/Green/Gold)"),
    Doubloon  UMETA(DisplayName = "Doubloon (Gold Coin)"),
    Cup         UMETA(DisplayName = "Cup (Plastic)")
};

/**
 * Main player character for the Mardi Gras Parade game
 * Catches collectibles thrown from parade floats
 * 
 * DESIGNER-FRIENDLY: All values can be edited in Blueprint!
 */
UCLASS()
class MARDIGRASPARADE_API AParadePlayerCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    AParadePlayerCharacter();

    // ==========================================
    // MOVEMENT SETTINGS (Edit in Blueprint!)
    // ==========================================
    
    /** Base movement speed in cm/s - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Config", 
        meta = (UIMin = "0", UIMax = "1000", DisplayName = "Base Move Speed"))
    float BaseMoveSpeed = 600.0f;
    
    /** Speed multiplier when power-up active - EDITABLE IN BLUEPRINT */
  UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Config",
        meta = (UIMin = "1.0", UIMax = "3.0", DisplayName = "Speed Boost Multiplier"))
    float SpeedBoostMultiplier = 1.5f;
    
    /** How fast player rotates to face movement direction - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Config",
  meta = (UIMin = "1.0", UIMax = "20.0", DisplayName = "Rotation Speed"))
    float RotationSpeed = 10.0f;

    // ==========================================
    // GAMEPLAY SETTINGS (Edit in Blueprint!)
    // ==========================================
    
    /** Current score - VISIBLE IN BLUEPRINT */
    UPROPERTY(BlueprintReadWrite, Category = "Game|Stats")
    int32 Score = 0;
    
    /** Current combo count - VISIBLE IN BLUEPRINT */
    UPROPERTY(BlueprintReadWrite, Category = "Game|Stats")
    int32 Combo = 0;
    
    /** Maximum combo reached this game - VISIBLE IN BLUEPRINT */
    UPROPERTY(BlueprintReadWrite, Category = "Game|Stats")
    int32 MaxCombo = 0;
    
    /** Total catches this game - VISIBLE IN BLUEPRINT */
    UPROPERTY(BlueprintReadWrite, Category = "Game|Stats")
    int32 TotalCatches = 0;
    
    /** Player's assigned color for 3x bonus - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Color",
  meta = (DisplayName = "Player Color"))
    ECollectibleColor PlayerColor;
    
    /** Radius to catch collectibles in cm - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Config",
        meta = (UIMin = "50", UIMax = "500", DisplayName = "Catch Radius"))
    float CatchRadius = 150.0f;
    
    /** Total coins earned - VISIBLE IN BLUEPRINT */
    UPROPERTY(BlueprintReadWrite, Category = "Game|Economy")
    int32 Coins = 0;

    // ==========================================
    // INPUT SYSTEM (Enhanced Input)
    // ==========================================
    
    /** Input Mapping Context - ASSIGN IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Input",
     meta = (AllowPrivateAccess = "true", DisplayName = "Input Mapping Context"))
    class UInputMappingContext* DefaultMappingContext;
    
    /** Move Input Action (WASD/Arrows) - ASSIGN IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Input",
        meta = (AllowPrivateAccess = "true", DisplayName = "Move Action"))
    class UInputAction* MoveAction;
    
    /** Click-to-Move Input Action - ASSIGN IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Input",
        meta = (AllowPrivateAccess = "true", DisplayName = "Click Move Action"))
    class UInputAction* ClickMoveAction;
    
    /** Look/Camera Input Action - ASSIGN IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Input",
 meta = (AllowPrivateAccess = "true", DisplayName = "Look Action"))
    class UInputAction* LookAction;

    // ==========================================
  // AUDIO SETTINGS (Edit in Blueprint!)
    // ==========================================
    
    /** Sound when catching collectible - ASSIGN IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Audio",
        meta = (DisplayName = "Catch Sound"))
    class USoundBase* CatchSound;
    
    /** Sound for footsteps - ASSIGN IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Audio",
        meta = (DisplayName = "Footstep Sound"))
    class USoundBase* FootstepSound;
    
    /** Audio volume for sounds - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Audio",
        meta = (UIMin = "0.0", UIMax = "1.0", DisplayName = "Audio Volume"))
    float AudioVolume = 1.0f;

    // ==========================================
// BLUEPRINT CALLABLE FUNCTIONS
    // ==========================================
    
    /**
     * Called when player catches a collectible
     * @param Collectible - The collectible that was caught
     */
 UFUNCTION(BlueprintCallable, Category = "Game")
  void CatchCollectible(class ACollectible* Collectible);
    
    /**
  * Set a target location for click-to-move
     * @param TargetLocation - World location to move toward
     */
    UFUNCTION(BlueprintCallable, Category = "Movement")
    void SetMoveTarget(FVector TargetLocation);
    
  /**
     * Clear the current move target
 */
    UFUNCTION(BlueprintCallable, Category = "Movement")
    void ClearMoveTarget();
 
    /**
     * Activate speed boost power-up
     * @param Duration - How long the boost lasts in seconds
  */
    UFUNCTION(BlueprintCallable, Category = "PowerUps")
    void ActivateSpeedBoost(float Duration = 8.0f);
    
    /**
     * Check if speed boost is currently active
     */
    UFUNCTION(BlueprintPure, Category = "PowerUps")
 bool IsSpeedBoostActive() const { return bSpeedBoostActive; }
    
    /**
     * Get current effective move speed (with boosts applied)
     */
    UFUNCTION(BlueprintPure, Category = "Movement")
    float GetCurrentMoveSpeed() const;

    // ==========================================
    // BLUEPRINT IMPLEMENTABLE EVENTS
    // ==========================================

    /**
     * Event called when player catches collectible
     * IMPLEMENT IN BLUEPRINT for custom behavior!
     */
    UFUNCTION(BlueprintImplementableEvent, Category = "Game|Events")
    void OnCollectibleCaught(class ACollectible* Collectible, int32 PointsAwarded);
    
    /**
     * Event called when combo increases
     * IMPLEMENT IN BLUEPRINT for visual effects!
     */
    UFUNCTION(BlueprintImplementableEvent, Category = "Game|Events")
    void OnComboIncreased(int32 NewCombo);
    
    /**
     * Event called when power-up activated
     * IMPLEMENT IN BLUEPRINT for visual effects!
     */
    UFUNCTION(BlueprintImplementableEvent, Category = "Game|Events")
    void OnPowerUpActivated(FString PowerUpType);

protected:
  virtual void BeginPlay() override;
 virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

public:
    virtual void Tick(float DeltaTime) override;

private:
    // Movement state
    FVector MouseTargetLocation = FVector::ZeroVector;
    bool bHasMouseTarget = false;
    
    // Power-up state
    bool bSpeedBoostActive = false;
    FTimerHandle SpeedBoostTimerHandle;
    
    // Combo tracking
    float LastCatchTime = 0.0f;
    const float ComboWindow = 3.0f; // 3 seconds to continue combo
 
    // Input callbacks
    void Move(const FInputActionValue& Value);
    void Look(const FInputActionValue& Value);
    void ClickToMove(const FInputActionValue& Value);
    
    // Movement helpers
    void MoveToTarget(float DeltaTime);
    void UpdateMovementSpeed();
    
  // Power-up helpers
    void OnSpeedBoostEnd();
    
    // Scoring helpers
    void UpdateCombo();
    void BreakCombo();
    void AddScore(int32 Points);
};
