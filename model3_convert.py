'''
轉換拆包出來的model3.json
重命名、組織motions以及增加n個hitarea(如TouchHead, TouchBody, TouchSpecial)
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

base = input("Directory: ")

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
    model["HitAreas"] = []
    hitAreaCount = 0
    for motion in motions:
        motionFile = os.path.basename(motion["File"])
        motionFileName = os.path.splitext(motionFile)[0]
        motionFileName = motionFileName[0:motionFileName.index(".")]
        model["FileReferences"]["Motions"][motionFileName] = [motion]
        if "touch" in motionFileName:
            hitAreaCount += 1
            hitArea = ""
            for split in motionFileName.split("_"):
                str = list(split)
                str[0] = str[0].upper()
                hitArea += ''.join(str)
            model["HitAreas"].append({
                "Id": hitArea, "Name": motionFileName
            })
            
    print(f"Rename all {len(model['FileReferences']['Motions'].keys())} motions")
    print(f"Add {hitAreaCount} HitAreas")
    
    model3.seek(0)
    model3.write(json.dumps(model, indent=2))
    model3.truncate()
    model3.close()

print(f"Processed all {len(folders)} l2d")