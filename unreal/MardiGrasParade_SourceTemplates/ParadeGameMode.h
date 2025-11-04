// ParadeGameMode.h
// Mardi Gras Parade Game - Game Mode
// Place this in: Source/MardiGrasParade/GameModes/ParadeGameMode.h

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "ParadeGameMode.generated.h"

/**
 * Game phases for Mardi Gras Parade game
 */
UENUM(BlueprintType)
enum class EGamePhase : uint8
{
    Tutorial    UMETA(DisplayName = "Tutorial"),
    Playing   UMETA(DisplayName = "Playing"),
    Won         UMETA(DisplayName = "Won"),
    AdOffer  UMETA(DisplayName = "Ad Offer")
};

/**
 * Main game mode for Mardi Gras Parade game
 * Controls game flow, spawning, and difficulty progression
 * 
 * DESIGNER-FRIENDLY: Edit all values in Blueprint!
 */
UCLASS()
class MARDIGRASPARADE_API AParadeGameMode : public AGameModeBase
{
    GENERATED_BODY()

public:
    AParadeGameMode();

    // ==========================================
    // GAME STATE (Visible in Blueprint)
    // ==========================================
    
    /** Current game phase - VISIBLE IN BLUEPRINT */
    UPROPERTY(BlueprintReadWrite, Category = "Game|State")
    EGamePhase CurrentPhase = EGamePhase::Tutorial;
    
    /** Current level number - VISIBLE IN BLUEPRINT */
    UPROPERTY(BlueprintReadWrite, Category = "Game|State")
    int32 CurrentLevel = 1;
    
    /** Total floats for current level - VISIBLE IN BLUEPRINT */
    UPROPERTY(BlueprintReadWrite, Category = "Game|State")
    int32 TotalFloats = 10;
    
 /** Number of floats that have passed - VISIBLE IN BLUEPRINT */
    UPROPERTY(BlueprintReadWrite, Category = "Game|State")
    int32 FloatsPassed = 0;
    
    /** Target score to complete level - VISIBLE IN BLUEPRINT */
    UPROPERTY(BlueprintReadWrite, Category = "Game|State")
    int32 TargetScore = 5;

    // ==========================================
    // LEVEL PROGRESSION (Edit in Blueprint!)
    // ==========================================
    
    /** Starting level - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Progression",
        meta = (UIMin = "1", UIMax = "10", DisplayName = "Starting Level"))
    int32 StartingLevel = 1;
    
    /** Number of floats per level (Level 1 = 10, Level 2 = 20) - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Progression",
        meta = (UIMin = "5", UIMax = "20", DisplayName = "Floats Per Level"))
    int32 FloatsPerLevel = 10;
    
    /** Starting target score - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Progression",
        meta = (UIMin = "1", UIMax = "20", DisplayName = "Starting Target Score"))
    int32 StartingTargetScore = 5;
    
    /** How much target score increases each level - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Progression",
        meta = (UIMin = "1", UIMax = "10", DisplayName = "Score Increment Per Level"))
    int32 TargetScoreIncrement = 2;
    
    /** Maximum level (99 = unlimited) - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Progression",
      meta = (UIMin = "1", UIMax = "999", DisplayName = "Max Level"))
    int32 MaxLevel = 99;

    // ==========================================
    // DIFFICULTY CURVE (Edit in Blueprint!)
    // CASUAL CURVE - Designed for ages 10-80!
    // ==========================================
    
    /** Base float speed in cm/s - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Difficulty",
        meta = (UIMin = "50", UIMax = "500", DisplayName = "Base Float Speed"))
    float BaseFloatSpeed = 200.0f;
    
 /** Float speed increase per level after level 3 - EDITABLE IN BLUEPRINT */
  UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Difficulty",
        meta = (UIMin = "0", UIMax = "50", DisplayName = "Float Speed Increase"))
    float FloatSpeedIncreasePerLevel = 20.0f;
    
    /** Base throw interval in seconds - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Difficulty",
        meta = (UIMin = "1.0", UIMax = "10.0", DisplayName = "Base Throw Interval"))
    float BaseThrowInterval = 3.5f;
    
    /** How much throw interval decreases per level - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Difficulty",
    meta = (UIMin = "0.0", UIMax = "0.5", DisplayName = "Throw Interval Decrease"))
    float ThrowIntervalDecrease = 0.15f;
    
    /** Minimum throw interval (fastest throws) - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Difficulty",
        meta = (UIMin = "1.0", UIMax = "5.0", DisplayName = "Min Throw Interval"))
    float MinThrowInterval = 2.0f;

    // ==========================================
    // SPAWNING (Edit in Blueprint!)
    // ==========================================
    
    /** Float class to spawn - ASSIGN IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawning",
        meta = (DisplayName = "Float Class"))
    TSubclassOf<class AParadeFloat> FloatClass;
 
    /** Competitor bot class - ASSIGN IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawning",
        meta = (DisplayName = "Bot Class"))
    TSubclassOf<class ACompetitorBot> BotClass;
    
    /** Aggressive NPC class - ASSIGN IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawning",
        meta = (DisplayName = "NPC Class"))
    TSubclassOf<class AAggressiveNPC> NPCClass;
    
    /** Obstacle class - ASSIGN IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawning",
        meta = (DisplayName = "Obstacle Class"))
    TSubclassOf<class AObstacle> ObstacleClass;
    
    /** Float spawn location (start of street) - ASSIGN IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawning",
        meta = (DisplayName = "Float Spawn Location"))
    FVector FloatSpawnLocation = FVector(500.0f, 0.0f, 100.0f);
    
    /** Spacing between floats in cm - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawning",
        meta = (UIMin = "500", UIMax = "2000", DisplayName = "Float Spacing"))
  float FloatSpacing = 1000.0f;

    // ==========================================
    // POWER-UP SETTINGS (Edit in Blueprint!)
// ==========================================
    
    /** Speed boost duration in seconds - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|PowerUps",
        meta = (UIMin = "5", UIMax = "20", DisplayName = "Speed Boost Duration"))
    float SpeedBoostDuration = 8.0f;
    
    /** Double points duration in seconds - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|PowerUps",
 meta = (UIMin = "5", UIMax = "20", DisplayName = "Double Points Duration"))
    float DoublePointsDuration = 8.0f;
    
/** Chance for collectible to be power-up (0-100%) - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|PowerUps",
        meta = (UIMin = "0", UIMax = "10", DisplayName = "Power-Up Drop Chance %"))
    float PowerUpDropChance = 1.0f;

    // ==========================================
    // COMBO SYSTEM (Edit in Blueprint!)
    // ==========================================
    
    /** Time window to continue combo in seconds - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Combo",
        meta = (UIMin = "1.0", UIMax = "10.0", DisplayName = "Combo Window"))
    float ComboWindow = 3.0f;
    
    /** Award bonus coins for combos? - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Combo",
    meta = (DisplayName = "Enable Combo Coins"))
    bool bEnableComboBonusCoins = true;
    
    /** Break combo when hitting obstacle? - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|Combo",
        meta = (DisplayName = "Combo Break on Obstacle"))
    bool bComboBreakOnObstacle = true;

    // ==========================================
    // COLOR MATCHING (Edit in Blueprint!)
    // ==========================================
  
  /** Enable color matching bonus? - EDITABLE IN BLUEPRINT */
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|ColorMatch",
        meta = (DisplayName = "Enable Color Matching"))
    bool bEnableColorMatching = true;
    
    /** Multiplier for matching color (3x = triple points) - EDITABLE IN BLUEPRINT */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Game|ColorMatch",
    meta = (UIMin = "1", UIMax = "10", DisplayName = "Color Match Multiplier"))
    int32 ColorMatchMultiplier = 3;

    // ==========================================
    // BLUEPRINT CALLABLE FUNCTIONS
    // ==========================================
    
    /**
  * Start the game (transition from tutorial to playing)
     */
    UFUNCTION(BlueprintCallable, Category = "Game")
    void StartGame();
    
    /**
     * Advance to next level
     */
    UFUNCTION(BlueprintCallable, Category = "Game")
    void NextLevel();
    
    /**
     * Reset game to initial state
     */
    UFUNCTION(BlueprintCallable, Category = "Game")
    void ResetGame();
    
 /**
     * End game (player eliminated or quits)
  */
    UFUNCTION(BlueprintCallable, Category = "Game")
    void EndGame();
    
    /**
     * Mark that a float has passed the player
     */
    UFUNCTION(BlueprintCallable, Category = "Game")
    void MarkFloatPassed();
    
    /**
     * Spawn all parade floats for current level
     */
    UFUNCTION(BlueprintCallable, Category = "Spawning")
    void SpawnParadeFloats();
    
    /**
     * Spawn competitor bots
     */
    UFUNCTION(BlueprintCallable, Category = "Spawning")
    void SpawnCompetitorBots();
    
 /**
   * Spawn aggressive NPCs based on level
   */
    UFUNCTION(BlueprintCallable, Category = "Spawning")
    void SpawnAggressiveNPCs();
    
    /**
     * Spawn obstacles based on level
     */
    UFUNCTION(BlueprintCallable, Category = "Spawning")
    void SpawnObstacles();
    
    /**
     * Get float speed for current level
     */
    UFUNCTION(BlueprintPure, Category = "Game|Difficulty")
    float GetFloatSpeedForLevel(int32 Level) const;
    
    /**
     * Get throw interval for current level
     */
    UFUNCTION(BlueprintPure, Category = "Game|Difficulty")
    float GetThrowIntervalForLevel(int32 Level) const;
    
    /**
     * Get number of NPCs for given level (casual difficulty curve)
     */
    UFUNCTION(BlueprintPure, Category = "Game|Difficulty")
    int32 GetNPCCountForLevel(int32 Level) const;
    
    /**
     * Get number of obstacles for given level (casual difficulty curve)
     */
    UFUNCTION(BlueprintPure, Category = "Game|Difficulty")
    int32 GetObstacleCountForLevel(int32 Level) const;

    // ==========================================
    // BLUEPRINT IMPLEMENTABLE EVENTS
    // ==========================================
    
    /**
     * Event fired when game starts
     * IMPLEMENT IN BLUEPRINT for custom behavior!
     */
    UFUNCTION(BlueprintImplementableEvent, Category = "Game|Events")
    void OnGameStarted();
    
    /**
     * Event fired when level completes
  * IMPLEMENT IN BLUEPRINT for custom behavior!
     */
 UFUNCTION(BlueprintImplementableEvent, Category = "Game|Events")
    void OnLevelComplete(int32 CompletedLevel);
    
    /**
     * Event fired when game ends
     * IMPLEMENT IN BLUEPRINT for custom behavior!
     */
    UFUNCTION(BlueprintImplementableEvent, Category = "Game|Events")
    void OnGameEnded();

protected:
  virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;

private:
    // Spawned actors tracking
    TArray<class AParadeFloat*> SpawnedFloats;
    TArray<class ACompetitorBot*> SpawnedBots;
    TArray<class AAggressiveNPC*> SpawnedNPCs;
    TArray<class AObstacle*> SpawnedObstacles;
  
    // Internal helpers
    void CleanupSpawnedActors();
    void InitializeLevel();
};
