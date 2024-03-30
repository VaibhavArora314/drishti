from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer
import torch
from PIL import Image
import cv2


def predict_step(image_path):
    image = cv2.imread(image_path)  # Read image using OpenCV

    # Define grid proportions (adjust as needed)
    width, height = image.shape[1], image.shape[0]
    left_width = int(width / 3)
    center_width = width - 2 * left_width
    left_region = image[:, :left_width]
    center_region = image[:, left_width:left_width + center_width]
    right_region = image[:, left_width + center_width:]

    # Convert each region to PIL Image format
    left_image = Image.fromarray(left_region.astype('uint8'), 'RGB')
    center_image = Image.fromarray(center_region.astype('uint8'), 'RGB')
    right_image = Image.fromarray(right_region.astype('uint8'), 'RGB')

    # Load pre-trained model components
    model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
    feature_extractor = ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
    tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")

    device = torch.device("cpu")
    model.to(device)

    max_length = 30
    num_beams = 8
    gen_kwargs = {"max_length": max_length, "num_beams": num_beams}

    # Detect obstacles using thresholding (replace with your preferred method)
    obstacles = []
    for region in [left_region, center_region, right_region]:
        gray = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)
        thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)[1]
        obstacle_ratio = cv2.countNonZero(thresh) / (thresh.shape[0] * thresh.shape[1])
        obstacle_threshold = 0.5  # Adjust threshold as needed

        if obstacle_ratio > obstacle_threshold:
            obstacles.append("obstacle")
            break  # Exit loop if obstacle found in any region
        else:
            obstacles.append("clear")

    # Choose direction based on obstacle location (assuming straight path)
    if obstacles[0] == "obstacle":
        instruction = "Move to your right."
    elif obstacles[1] == "obstacle":
        instruction = "Move slightly to your left or right."  # Center obstacle, suggest minor adjustment
    elif obstacles[2] == "obstacle":
        instruction = "Move to your left."
    else:
        instruction = "The path ahead seems clear."  # No obstacles detected

    return instruction  # Single instruction string

# Example usage
# image_path = "sample-images/test1.jpg"
# instruction = predict_step(image_path)
# print(instruction)