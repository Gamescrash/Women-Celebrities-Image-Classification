import numpy as np
import pywt
import cv2

def w2d(img, mode='haar', level=1):
    if img is None:
        return None

    imArray = img
    # convert to grayscale if needed (OpenCV loads BGR)
    if len(imArray.shape) == 3:
        imArray = cv2.cvtColor(imArray, cv2.COLOR_BGR2GRAY)

    # convert to float in [0, 1]
    imArray = np.float32(imArray) / 255.0

    # compute wavelet coefficients
    coeffs = pywt.wavedec2(imArray, mode, level=level)

    # zero out approximation coefficients
    coeffs_H = list(coeffs)
    coeffs_H[0] *= 0

    # reconstruct image from detail coefficients
    imArray_H = pywt.waverec2(coeffs_H, mode)
    imArray_H = np.clip(imArray_H, 0, 1)
    imArray_H = np.uint8(imArray_H * 255)

    return imArray_H
