#!/usr/bin/env bash

version=v$(cat package.json | grep "version" | cut -d'"' -f4 )

7z a ./release/angular_build_"$version".7z -r ../dist/character-sheet/broswer/*
cp ./android/app/build/outputs/apk/debug/app-debug.apk ./release/dnd_character_sheet_"$version".apk

gh release create "$version" ../release/* --latest=true -t "$version"
