'''
轉換拆包出來的model3.json
重命名、組織motions以及增加3個hitarea(Head, Body, Special)
檔案結構須為(例):
assets
├─edu_3
│  │  edu_3.moc3
│  │  edu_3.model3.json
│  │  edu_3.physics3.json
│  ├─motions
│  └─textures
│
└─edu_4
    │  edu_4.moc3
    │  edu_4.model3.json
    │  edu_4.physics3.json
    ├─motions
    └─textures
'''

import os
import json

base = input("Base directory: ")

if not os.path.isdir(base):
    print("Error: Directory does not exist")
    exit(-1)

folders = os.listdir(base)
for folder in folders:
    print("Processing " + folder)

    model3Path = os.path.join(base, f"{folder}\\{folder}.model3.json")
    if not os.path.exists(model3Path):
        print("Error: model3.json file was not detected\n")
        continue

    model3 = open(model3Path, 'r+')
    model = json.loads(model3.read())
    motions = model["FileReferences"]["Motions"][""]

    model["FileReferences"]["Motions"] = {}
    for motion in motions:
        motionFile = os.path.basename(motion["File"])
        motionFileName = motionFile[0:motionFile.index(".")]
        model["FileReferences"]["Motions"][motionFileName] = [motion]
    print(f"Rename all {len(model['FileReferences']['Motions'].keys())} motions")

    model["HitAreas"] = [
        {"Id": "TouchSpecial","Name": "Special"},
        {"Id": "TouchHead","Name": "Head"},
        {"Id": "TouchBody","Name": "Body"}]
    print("Add 3 HitAreas")
    
    model3.seek(0)
    model3.write(json.dumps(model, indent=2))
    model3.truncate()
    model3.close()

    print("End " + folder + "\n")

print(f"Processed all {len(folders)} l2d")