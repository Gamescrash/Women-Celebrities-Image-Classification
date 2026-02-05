# Women Celebrities Image Classification

A compact, end-to-end notebook project for face detection, feature extraction, and celebrity classification.

**What you get**
- Face/eye detection with Haar cascades (OpenCV)
- Automated face cropping into `model/dataset/cropped/`
- Feature engineering with wavelet transforms (PyWavelets)
- Model comparison (SVM, Random Forest, Logistic Regression)
- Exported model and class mapping for reuse

**Classes in the dataset**
`belen_rodriguez`, `chiara_ferragni`, `iu`, `mia_khalifa`, `sydney_sweeney`.

**Project structure**
- `model/sport_person_classifier_model.ipynb` training + evaluation notebook
- `model/dataset/` dataset organized by class
- `model/test_images/` test images used by the notebook
- `model/opencv/haarcascades/` Haar cascade XML files
- `model/requirement.txt` Python dependencies
- `model/saved_model.pkl` exported trained model (joblib)
- `model/class_dictionary.json` class name → numeric id mapping

**Quick setup**
1. Create the virtual env:
```bash
python3 -m venv .venv
```
2. Activate it:
```bash
source .venv/bin/activate
```
3. Install dependencies:
```bash
pip install -r model/requirement.txt
```

**Run the notebook**
The notebook uses relative paths like `./test_images/...` and `./opencv/haarcascades/...`, so it should be run from the `model/` folder.

```bash
cd model
jupyter lab
```

If you do not have Jupyter installed:
```bash
pip install jupyter
```

**Training pipeline (high level)**
1. Detect faces and require at least two eyes.
2. Crop faces and save them under `model/dataset/cropped/`.
3. Build features by stacking the raw 32×32 RGB image and its wavelet transform.
4. Train and compare multiple classifiers.
5. Export the best model and class mapping.

**Artifacts**
- `model/saved_model.pkl` is the exported classifier after training.
- `model/class_dictionary.json` is the class mapping used during training and inference.

**Notes**
- The cropping step recreates `model/dataset/cropped/` and overwrites existing cropped images.
- If cascade paths are not resolved, verify the working directory or use absolute paths.
- Make sure you have the rights to use the dataset images; this material is intended for educational purposes only.
