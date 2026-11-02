# Product images with agy, one per job: python scripts/gen-products.py fridge washer dryer. Then node scripts/images.mjs.
import os, subprocess, sys
AGY = r"C:\Users\ameer\AppData\Local\agy\bin\agy.exe"
OUT = os.path.abspath("design/generated")
JOBS = {
    "fridge": "a two-door top-freezer household refrigerator, plain light silver doors with simple handles",
    "washer": "a front-loading automatic washing machine, white, round door with glass porthole, a blank control panel with one dial and no markings",
    "dryer": "a front-loading household clothes dryer, white, round solid door, a blank control panel with one dial and no markings",
    "dishwasher": "a freestanding household dishwasher, plain light silver front with a simple bar handle, a blank control strip with no markings",
    "freezer": "a white household chest freezer with a plain solid lid and a simple recessed handle, no markings",
    "microwave": "a countertop microwave oven, light silver body with a dark glass door and a simple handle, a blank control panel with one dial and no markings",
    "oven-stove": "a freestanding household gas cooker with four burners on top and an oven below, plain light silver, glass oven door, simple knobs with no markings",
    "water-heater": "a white cylindrical wall-mounted household electric water heater tank, plain smooth body with two short pipes at the bottom, no markings",
}
for name in sys.argv[1:] or JOBS:
    dest = os.path.join(OUT, name + ".png")
    prompt = (f'Use your image generation subagent and call generate_image once with ImagePaths ["{OUT}\\split-ac-indoor.png"] and AspectRatio "4:3". '
              f"Image prompt: A clean product illustration of {JOBS[name]}. Same three-quarter angle, soft even studio lighting and clean semi-realistic rendering style as the reference image, "
              "centred, whole object in frame with generous margin, on a pure white #FFFFFF background, only a very faint contact shadow. "
              "Absolutely no logos, brand names, text, letters, numbers, labels, icons, people or props. "
              f"Copy the generated image to {dest} (overwrite). Reply only with the saved path. Do not modify any other file.")
    subprocess.run([AGY, "-p", prompt, "--print-timeout", "5m0s", "--effort", "low"])
    print(name, "OK" if os.path.exists(dest) else "MISSING")
