#!/usr/bin/env bash

version=v$(cat package.json | grep "version" | cut -d'"' -f4 )

if [ $(git tag -l "$version") ]; then
    echo "Version already exists: $version"
    exit 0
fi
rm -rf release
mkdir release

cp ./android/app/build/outputs/apk/debug/app-debug.apk ./release/dnd_character_sheet_"$version".apk &&
bestzip ./release/angular_build_"$version".7z ./dist/character-sheet/browser/*

echo "
Version: $version"

gh release create "$version" ./release/* --latest=false -t "$version" && git push origin "$version"
