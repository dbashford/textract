# Setting up tesseract on mac
sudo port install tesseract
sudo port install tesseract-chi-sim
cat "export TESSDATA_PREFIX='/opt/local/share/tessdata/'" >> ~/.bash_profile
