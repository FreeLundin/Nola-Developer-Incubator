// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;

public class MardiGrasParade : ModuleRules
{
    public MardiGrasParade(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

        PublicDependencyModuleNames.AddRange(new string[] {
  "Core",
      "CoreUObject",
    "Engine",
      "InputCore",
     "EnhancedInput",
            "UMG",
         "Slate",
        "SlateCore",
         "AIModule",
    "NavigationSystem",
        "Http",
          "Json",
     "JsonUtilities"
    });

    PrivateDependencyModuleNames.AddRange(new string[] {
   "OnlineSubsystem",
            "OnlineSubsystemUtils"
   });

        // Uncomment if you are using online features
     // DynamicallyLoadedModuleNames.Add("OnlineSubsystemSteam");
    }
}
