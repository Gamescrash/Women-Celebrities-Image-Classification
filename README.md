# Women Celebrities Image Classification

**Overview**  
This repository contains a small dataset of women celebrities and an OpenCV notebook that demonstrates face/eye detection with Haar cascades. At the moment there is no trained classification model: the notebook is a starting point for preprocessing and face detection.

**Project structure**
- `model/sport_person_classifier_model.ipynb` OpenCV notebook examples (face/eye detection)
- `model/dataset/` dataset organized by class
- `model/test_images/` test images used by the notebook
- `model/opencv/haarcascades/` Haar cascade XML files
- `model/requirement.txt` minimal dependencies

**Classes in the dataset**
`belen_rodriguez`, `chiara_ferragni`, `iu`, `mia_khalifa`, `sydney_sweeney`.

**Quick setup**
1. Create the virtual env:
```bash
python3 -m venv .venv
```
1. Activate it:
```bash
source .venv/bin/activate
```
1. Install dependencies:
```bash
pip install -r model/requirement.txt
```

**Run the notebook**
The notebook uses relative paths like `./test_images/...` and `./opencv/haarcascades/...`, so it should be run from the `model/` folder.

Example:
```bash
cd model
jupyter lab
```

If you do not have Jupyter installed:
```bash
pip install jupyter
```

**Notes**
- If the cascade paths are not resolved, verify the working directory or use absolute paths.
- Make sure you have the rights to use the dataset images; this material is intended for educational purposes only.
