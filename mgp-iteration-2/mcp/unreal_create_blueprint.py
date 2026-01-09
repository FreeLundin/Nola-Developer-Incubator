# Unreal Editor Python script (requires running inside Unreal's Python environment)
# Creates a Blueprint asset with variables based on controls mapping.

# Notes:
# - Place this script into an Unreal project's "Content/Scripts" and run via the Editor Scripting utilities.
# - This script uses the Unreal Python API (module `unreal`). It will not run in a normal Python interpreter.

import unreal

def create_controls_blueprint(asset_name='BP_ControlsPreset', package_path='/Game/MGP/Blueprints', variables=None):
    if variables is None:
        variables = {
            'FlipX': False,
            'Sensitivity': 1.0,
            'Handedness': 'left'
        }

    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    factory = unreal.BlueprintFactory()

    # Ensure package path exists
    if not unreal.EditorAssetLibrary.does_directory_exist(package_path):
        unreal.EditorAssetLibrary.make_directory(package_path)

    asset = asset_tools.create_asset(asset_name, package_path, unreal.Blueprint, factory)
    if not asset:
        unreal.log_error('Failed to create blueprint asset')
        return None

    # Set default variables on the generated Blueprint (use variables as default values for properties)
    # This uses the asset's GeneratedClass default object
    gen_class = asset.GeneratedClass
    default_obj = unreal.get_default_object(gen_class)

    for var_name, value in variables.items():
        # Attempt to set property if it exists
        if unreal.EditorUtilityLibrary.get_class_display_name(gen_class).find(var_name) != -1:
            pass
        try:
            setattr(default_obj, var_name, value)
        except Exception as e:
            unreal.log('Could not set var: {} -> {}'.format(var_name, e))

    unreal.EditorAssetLibrary.save_loaded_asset(asset)
    unreal.log('Created blueprint: {}/{}'.format(package_path, asset_name))
    return asset

# Example usage when run inside Editor: create_controls_blueprint()
