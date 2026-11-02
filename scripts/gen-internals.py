# Cutaway ("skeleton") illustrations with agy, one job each, in parallel: python scripts/gen-internals.py [names]
# Reads design/generated/<name>.png as the reference so the angle and size match the shell, writes design/generated/internals/<name>.png.
# The split AC came back mirrored against its shell, so it was flipped once (ImageOps.mirror) and its spots mirrored. Then: python scripts/cutout.py internals, set spots in src/components/appliance-internals.json, node scripts/images.mjs.
import os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
AGY = r"C:\Users\ameer\AppData\Local\agy\bin\agy.exe"
SRC = os.path.abspath("design/generated")
OUT = os.path.join(SRC, "internals")
JOBS = {
    "split-ac-indoor": "the wall-mounted split air conditioner indoor unit with its front cover and casing removed, showing: the pleated air filter, the long aluminium fin evaporator coil with copper pipes, the cross-flow blower fan roller, the drain pan with a drain pipe, and a small green control circuit board at one end",
    "window-ac": "the window air conditioner with its outer casing and front grille cut away, showing: the air filter, the evaporator coil, the fan motor with its fan blade, the compressor, the condenser coil, the drain pan, and a small control circuit board",
    "fridge": "the two-door top-freezer refrigerator with its doors and outer panels cut away, showing: the compressor and condenser at the lower back, the evaporator coil and fan in the freezer, the drain tube with its pan, the shelves faint, and a small control circuit board at the top",
    "washer": "the front-loading washing machine with its outer casing cut away, showing: the drum, the motor with its drive belt, the drain pump with its hose, the two shock absorbers under the drum, and a small control circuit board behind the top panel",
    "dryer": "the front-loading clothes dryer with its outer casing cut away, showing: the drum, the heating element, the lint filter, the drive belt around the drum with its motor, and a small control circuit board behind the top panel",
}
def run(name):
    dest = os.path.join(OUT, name + ".png")
    prompt = (f'Use your image generation subagent and call generate_image once with ImagePaths ["{SRC}\\{name}.png"] and AspectRatio "4:3". '
              f"Image prompt: A clean technical cutaway illustration of {JOBS[name]}. Exactly the same three-quarter angle, position, size and proportions as the reference image, "
              "same soft even studio lighting and clean semi-realistic rendering style, whole object in frame with generous margin, on a pure white #FFFFFF background, only a very faint contact shadow. "
              "The parts are clearly separated and readable, in realistic muted colours, each distinct from its neighbours. "
              "Absolutely no logos, brand names, text, letters, numbers, labels, arrows, callouts, icons, people or props. "
              f"Copy the generated image to {dest} (overwrite). Reply only with the saved path. Do not modify any other file.")
    subprocess.run([AGY, "-p", prompt, "--print-timeout", "5m0s", "--effort", "low"], capture_output=True, text=True, encoding="utf-8", errors="replace")
    return name, os.path.exists(dest)
os.makedirs(OUT, exist_ok=True)
with ThreadPoolExecutor(max_workers=5) as ex:
    for name, ok in ex.map(run, sys.argv[1:] or list(JOBS)):
        print(name, "OK" if ok else "MISSING", flush=True)
