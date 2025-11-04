# Automated Unreal Engine 5.7 Project Setup Script
# Mardi Gras Parade Game - Automated Setup
# Run this script after installing Unreal Engine 5.7

param(
    [string]$UnrealEnginePath = "C:\Program Files\Epic Games\UE_5.7\Engine\Binaries\Win64\UnrealEditor.exe",
    [string]$ProjectName = "MardiGrasParade",
    [switch]$SkipUnrealCreation = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Mardi Gras Parade - Unreal Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$RootDir = "C:\Users\BLund\source\repos\FreeLundin\Nola-Developer-Incubator"
$UnrealDir = Join-Path $RootDir "unreal"
$ProjectDir = Join-Path $UnrealDir $ProjectName

# Step 1: Check prerequisites
Write-Host "[1/10] Checking prerequisites..." -ForegroundColor Yellow

# Check if Unreal Engine exists
if (-not (Test-Path $UnrealEnginePath)) {
    Write-Host "? Unreal Engine 5.7 not found at: $UnrealEnginePath" -ForegroundColor Red
    Write-Host "Please install Unreal Engine 5.7 from Epic Games Launcher" -ForegroundColor Yellow
    Write-Host "Or specify custom path with -UnrealEnginePath parameter" -ForegroundColor Yellow
    exit 1
}
Write-Host "? Unreal Engine 5.7 found" -ForegroundColor Green

# Check Visual Studio
$VSWhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
if (Test-Path $VSWhere) {
 $VSPath = & $VSWhere -latest -property installationPath
    if ($VSPath) {
        Write-Host "? Visual Studio found at: $VSPath" -ForegroundColor Green
    }
} else {
    Write-Host "??  Visual Studio not detected - you may need it for C++ compilation" -ForegroundColor Yellow
}

# Check Git LFS
try {
    $gitLfsVersion = git lfs version 2>$null
    if ($gitLfsVersion) {
   Write-Host "? Git LFS installed: $gitLfsVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "??  Git LFS not installed - install from: https://git-lfs.github.com/" -ForegroundColor Yellow
}

# Step 2: Create directory structure
Write-Host ""
Write-Host "[2/10] Creating directory structure..." -ForegroundColor Yellow

$Directories = @(
    "$UnrealDir",
    "$ProjectDir",
    "$ProjectDir\Source",
    "$ProjectDir\Source\$ProjectName",
    "$ProjectDir\Source\$ProjectName\Characters",
    "$ProjectDir\Source\$ProjectName\GameModes",
    "$ProjectDir\Source\$ProjectName\Collectibles",
    "$ProjectDir\Source\$ProjectName\AI",
    "$ProjectDir\Content",
    "$ProjectDir\Content\Blueprints",
    "$ProjectDir\Content\Blueprints\Characters",
    "$ProjectDir\Content\Blueprints\Floats",
    "$ProjectDir\Content\Blueprints\Collectibles",
    "$ProjectDir\Content\Blueprints\AI",
    "$ProjectDir\Content\Blueprints\Core",
    "$ProjectDir\Content\Materials",
    "$ProjectDir\Content\Meshes",
    "$ProjectDir\Content\Textures",
    "$ProjectDir\Content\Audio",
    "$ProjectDir\Content\UI",
    "$ProjectDir\Content\Maps",
 "$ProjectDir\Config"
)

foreach ($dir in $Directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}
Write-Host "? Directory structure created" -ForegroundColor Green

# Step 3: Copy C++ source templates
Write-Host ""
Write-Host "[3/10] Copying C++ source templates..." -ForegroundColor Yellow

$SourceTemplateDir = Join-Path $UnrealDir "MardiGrasParade_SourceTemplates"
if (Test-Path $SourceTemplateDir) {
    # Copy player character files
    if (Test-Path "$SourceTemplateDir\ParadePlayerCharacter.h") {
     Copy-Item "$SourceTemplateDir\ParadePlayerCharacter.h" `
            -Destination "$ProjectDir\Source\$ProjectName\Characters\" -Force
        Write-Host "  ? Copied ParadePlayerCharacter.h" -ForegroundColor Gray
    }
    
    if (Test-Path "$SourceTemplateDir\ParadePlayerCharacter.cpp") {
        Copy-Item "$SourceTemplateDir\ParadePlayerCharacter.cpp" `
 -Destination "$ProjectDir\Source\$ProjectName\Characters\" -Force
      Write-Host "  ? Copied ParadePlayerCharacter.cpp" -ForegroundColor Gray
    }
    
    # Copy game mode files
    if (Test-Path "$SourceTemplateDir\ParadeGameMode.h") {
        Copy-Item "$SourceTemplateDir\ParadeGameMode.h" `
            -Destination "$ProjectDir\Source\$ProjectName\GameModes\" -Force
        Write-Host "  ? Copied ParadeGameMode.h" -ForegroundColor Gray
    }
    
    Write-Host "? C++ templates copied" -ForegroundColor Green
} else {
 Write-Host "??  Source templates not found - will need to create manually" -ForegroundColor Yellow
}

# Step 4: Create .uproject file
Write-Host ""
Write-Host "[4/10] Creating .uproject file..." -ForegroundColor Yellow

$UProjectContent = @"
{
    "FileVersion": 3,
    "EngineAssociation": "5.7",
    "Category": "",
    "Description": "Mardi Gras Parade Game - Catch beads, doubloons, and cups from parade floats!",
    "Modules": [
        {
       "Name": "$ProjectName",
         "Type": "Runtime",
          "LoadingPhase": "Default",
 "AdditionalDependencies": [
      "Engine",
       "EnhancedInput",
      "UMG",
 "AIModule"
 ]
        }
    ],
    "Plugins": [
        {
            "Name": "EnhancedInput",
       "Enabled": true
        },
        {
            "Name": "ModelingToolsEditorMode",
            "Enabled": true
        },
        {
   "Name": "GeometryScripting",
            "Enabled": true
        }
    ],
    "TargetPlatforms": [
        "Windows",
"Android",
     "IOS"
    ]
}
"@

$UProjectPath = Join-Path $ProjectDir "$ProjectName.uproject"
$UProjectContent | Out-File -FilePath $UProjectPath -Encoding UTF8
Write-Host "? .uproject file created" -ForegroundColor Green

# Step 5: Create Build.cs file
Write-Host ""
Write-Host "[5/10] Creating Build.cs file..." -ForegroundColor Yellow

$BuildCSContent = @"
// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;

public class $ProjectName : ModuleRules
{
    public $ProjectName(ReadOnlyTargetRules Target) : base(Target)
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
"@

$BuildCSPath = Join-Path "$ProjectDir\Source\$ProjectName" "$ProjectName.Build.cs"
$BuildCSContent | Out-File -FilePath $BuildCSPath -Encoding UTF8
Write-Host "? Build.cs file created" -ForegroundColor Green

# Step 6: Create module header files
Write-Host ""
Write-Host "[6/10] Creating module header files..." -ForegroundColor Yellow

$ModuleHeaderContent = @"
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Modules/ModuleManager.h"

class F${ProjectName}Module : public IModuleInterface
{
public:
    /** IModuleInterface implementation */
    virtual void StartupModule() override;
    virtual void ShutdownModule() override;
};
"@

$ModuleHeaderPath = Join-Path "$ProjectDir\Source\$ProjectName" "$ProjectName.h"
$ModuleHeaderContent | Out-File -FilePath $ModuleHeaderPath -Encoding UTF8

$ModuleCppContent = @"
// Copyright Epic Games, Inc. All Rights Reserved.

#include "$ProjectName.h"
#include "Modules/ModuleManager.h"

IMPLEMENT_PRIMARY_GAME_MODULE(FDefaultGameModuleImpl, $ProjectName, "$ProjectName");

void F${ProjectName}Module::StartupModule()
{
    // This code will execute after your module is loaded into memory
}

void F${ProjectName}Module::ShutdownModule()
{
    // This function may be called during shutdown to clean up your module
}
"@

$ModuleCppPath = Join-Path "$ProjectDir\Source\$ProjectName" "$ProjectName.cpp"
$ModuleCppContent | Out-File -FilePath $ModuleCppPath -Encoding UTF8
Write-Host "? Module files created" -ForegroundColor Green

# Step 7: Create Target.cs files
Write-Host ""
Write-Host "[7/10] Creating Target.cs files..." -ForegroundColor Yellow

$GameTargetContent = @"
// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;
using System.Collections.Generic;

public class ${ProjectName}Target : TargetRules
{
    public ${ProjectName}Target(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Game;
DefaultBuildSettings = BuildSettingsVersion.V4;
        IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_3;
        ExtraModuleNames.Add("$ProjectName");
    }
}
"@

$EditorTargetContent = @"
// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;
using System.Collections.Generic;

public class ${ProjectName}EditorTarget : TargetRules
{
    public ${ProjectName}EditorTarget(TargetInfo Target) : base(Target)
    {
      Type = TargetType.Editor;
    DefaultBuildSettings = BuildSettingsVersion.V4;
        IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_3;
      ExtraModuleNames.Add("$ProjectName");
    }
}
"@

$GameTargetPath = Join-Path "$ProjectDir\Source" "${ProjectName}.Target.cs"
$EditorTargetPath = Join-Path "$ProjectDir\Source" "${ProjectName}Editor.Target.cs"

$GameTargetContent | Out-File -FilePath $GameTargetPath -Encoding UTF8
$EditorTargetContent | Out-File -FilePath $EditorTargetPath -Encoding UTF8
Write-Host "? Target.cs files created" -ForegroundColor Green

# Step 8: Create DefaultEngine.ini
Write-Host ""
Write-Host "[8/10] Creating config files..." -ForegroundColor Yellow

$DefaultEngineIni = @"
[/Script/EngineSettings.GameMapsSettings]
GameDefaultMap=/Game/Maps/ParadeStreet_Level.ParadeStreet_Level
EditorStartupMap=/Game/Maps/ParadeStreet_Level.ParadeStreet_Level
GlobalDefaultGameMode=/Script/$ProjectName.ParadeGameMode

[/Script/Engine.RendererSettings]
r.Mobile.EnableNoPrecomputedLightingCSMShader=True
r.DefaultFeature.AutoExposure.ExtendDefaultLuminanceRange=True
r.DefaultFeature.AutoExposure.Method=2
r.GenerateMeshDistanceFields=True
r.DynamicGlobalIlluminationMethod=1
r.ReflectionMethod=1
r.Shadow.Virtual.Enable=1
r.SkinCache.CompileShaders=True
r.RayTracing=False

[/Script/WindowsTargetPlatform.WindowsTargetSettings]
DefaultGraphicsRHI=DefaultGraphicsRHI_DX12
Compiler=Default

[/Script/$ProjectName.ParadeGameMode]
BackendURL="http://localhost:5000"
Platform="unreal"
bEnableAPILogs=True

[/Script/EnhancedInput.EnhancedInputDeveloperSettings]
bEnableDefaultMappingContexts=True

[/Script/Engine.Engine]
+ActiveGameNameRedirects=(OldGameName="TP_ThirdPerson",NewGameName="/Script/$ProjectName")
+ActiveGameNameRedirects=(OldGameName="/Script/TP_ThirdPerson",NewGameName="/Script/$ProjectName")
"@

$DefaultEngineIniPath = Join-Path "$ProjectDir\Config" "DefaultEngine.ini"
$DefaultEngineIni | Out-File -FilePath $DefaultEngineIniPath -Encoding UTF8
Write-Host "? DefaultEngine.ini created" -ForegroundColor Green

# Step 9: Update Git configuration
Write-Host ""
Write-Host "[9/10] Updating Git configuration..." -ForegroundColor Yellow

# Update .gitignore
$GitIgnorePath = Join-Path $RootDir ".gitignore"
$GitIgnoreContent = @"

# Unreal Engine
$ProjectName/Binaries/
$ProjectName/Intermediate/
$ProjectName/Saved/
$ProjectName/DerivedDataCache/
$ProjectName/.vs/
$ProjectName/.vscode/
*.sln
*.suo
*.opensdf
*.sdf
*.VC.db
*.VC.opendb
*.pdb
*.iobj
*.ipdb
*.exp
[Bb]uild/
[Bb]uilds/
"@

Add-Content -Path $GitIgnorePath -Value $GitIgnoreContent
Write-Host "? .gitignore updated" -ForegroundColor Green

# Update .gitattributes
$GitAttributesPath = Join-Path $RootDir ".gitattributes"
if (-not (Test-Path $GitAttributesPath)) {
    New-Item -ItemType File -Path $GitAttributesPath -Force | Out-Null
}

$GitAttributesContent = @"

# Unreal Engine LFS
*.uasset filter=lfs diff=lfs merge=lfs -text
*.umap filter=lfs diff=lfs merge=lfs -text
*.upk filter=lfs diff=lfs merge=lfs -text
*.udk filter=lfs diff=lfs merge=lfs -text

# 3D Models
*.fbx filter=lfs diff=lfs merge=lfs -text
*.obj filter=lfs diff=lfs merge=lfs -text
*.blend filter=lfs diff=lfs merge=lfs -text

# Textures
*.png filter=lfs diff=lfs merge=lfs -text
*.tga filter=lfs diff=lfs merge=lfs -text
*.exr filter=lfs diff=lfs merge=lfs -text
*.hdr filter=lfs diff=lfs merge=lfs -text
*.psd filter=lfs diff=lfs merge=lfs -text

# Audio
*.wav filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.ogg filter=lfs diff=lfs merge=lfs -text

# Video
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text
"@

Add-Content -Path $GitAttributesPath -Value $GitAttributesContent
Write-Host "? .gitattributes updated" -ForegroundColor Green

# Step 10: Create README for Unreal project
Write-Host ""
Write-Host "[10/10] Creating Unreal project README..." -ForegroundColor Yellow

$UnrealReadme = @"
# Mardi Gras Parade - Unreal Engine Project

## ?? Quick Start

1. **Generate Visual Studio project files:**
   - Right-click \`$ProjectName.uproject\`
   - Select "Generate Visual Studio project files"

2. **Open in Visual Studio:**
   - Open \`$ProjectName.sln\`
 - Build Solution (F7)
   - Wait for compilation to complete

3. **Open in Unreal Editor:**
   - Double-click \`$ProjectName.uproject\`
   - Press Play (Alt+P) to test

## ?? Project Structure

\`\`\`
Source/$ProjectName/
??? Characters/          # Player character C++ classes
?   ??? ParadePlayerCharacter.h
?   ??? ParadePlayerCharacter.cpp
??? GameModes/     # Game mode C++ classes
? ??? ParadeGameMode.h
?   ??? ParadeGameMode.cpp
??? Collectibles/       # Collectible item classes (to be created)
??? AI/        # AI bot classes (to be created)

Content/
??? Blueprints/      # Blueprint classes
?   ??? Characters/     # BP_ParadePlayer
?   ??? Floats/  # BP_ParadeFloat
?   ??? Collectibles/ # BP_Collectible_[Type]
?   ??? AI/             # BP_CompetitorBot, BP_AggressiveNPC
?   ??? Core/       # BP_ParadeGameMode
??? Materials/ # Materials and material instances
??? Meshes/        # 3D models
??? Textures/           # Textures
??? Audio/       # Sounds and music
??? UI/      # UMG widgets
??? Maps/           # Levels (ParadeStreet_Level)
\`\`\`

## ?? Next Steps

### Phase 1 - Foundation (Current)

- [x] Project structure created
- [x] C++ player character class
- [x] C++ game mode class
- [ ] Create player Blueprint (BP_ParadePlayer)
- [ ] Create basic level (ParadeStreet_Level)
- [ ] Test player movement

### Phase 2 - Core Gameplay

- [ ] Create parade float C++ class
- [ ] Create collectible C++ class
- [ ] Create Blueprint variants
- [ ] Implement catching mechanics
- [ ] Add scoring system

See \`UNREAL_CONVERSION_PLAN.md\` in root directory for full roadmap.

## ??? Development Workflow

1. **Edit C++ code in Visual Studio**
2. **Compile (Ctrl+Alt+F11 in Unreal or F7 in VS)**
3. **Create/edit Blueprints in Unreal Editor**
4. **Test with Play (Alt+P)**
5. **Commit changes to Git**

## ?? Documentation

- **Full Conversion Plan:** ../UNREAL_CONVERSION_PLAN.md
- **Blueprint Guide:** ../UNREAL_BLUEPRINT_GUIDE.md
- **Quick Start:** ../QUICK_START_UNREAL.md
- **Running Both Versions:** ../RUNNING_BOTH_VERSIONS.md

## ?? Troubleshooting

**Project won't open:**
- Regenerate VS project files
- Build in Visual Studio first

**Code won't compile:**
- Delete Binaries/, Intermediate/, Saved/
- Regenerate VS project files
- Clean rebuild

**Need help?**
- Check troubleshooting docs
- Ask in team chat
- Create GitHub issue

## ?? Happy Developing!

Laissez les bons temps rouler! ??
"@

$UnrealReadmePath = Join-Path $ProjectDir "README.md"
$UnrealReadme | Out-File -FilePath $UnrealReadmePath -Encoding UTF8
Write-Host "? Unreal project README created" -ForegroundColor Green

# Final summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete! ??" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Project created at:" -ForegroundColor Cyan
Write-Host "  $ProjectDir" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Right-click $ProjectName.uproject" -ForegroundColor White
Write-Host "  2. Select 'Generate Visual Studio project files'" -ForegroundColor White
Write-Host "  3. Open $ProjectName.sln in Visual Studio" -ForegroundColor White
Write-Host "  4. Build Solution (F7)" -ForegroundColor White
Write-Host "  5. Open $ProjectName.uproject in Unreal Editor" -ForegroundColor White
Write-Host "  6. Start building! (See UNREAL_CONVERSION_PLAN.md)" -ForegroundColor White
Write-Host ""
Write-Host "Documentation available at:" -ForegroundColor Cyan
Write-Host "  - UNREAL_CONVERSION_PLAN.md" -ForegroundColor White
Write-Host "  - UNREAL_BLUEPRINT_GUIDE.md" -ForegroundColor White
Write-Host "  - QUICK_START_UNREAL.md" -ForegroundColor White
Write-Host "  - RUNNING_BOTH_VERSIONS.md" -ForegroundColor White
Write-Host ""
Write-Host "Happy developing! ????" -ForegroundColor Green
Write-Host ""
