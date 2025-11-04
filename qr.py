import qrcode
import os
from pathlib import Path

def create_qr_code(url, filename=None, output_dir="qr_codes"):
    """
    Generate a QR code from a URL and save it as an image.
    
    Args:
        url (str): The website URL to convert to QR code
        filename (str): Optional custom filename (without extension)
        output_dir (str): Directory to save QR codes (default: "qr_codes")
    
    Returns:
        str: Path to the saved QR code image
    """
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Generate filename if not provided
    if filename is None:
        # Use domain name as filename
        filename = url.replace("https://", "").replace("http://", "").replace("/", "_").replace(":", "_")
        if len(filename) > 50:
            filename = filename[:50]
    
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,  # Controls size (1 is smallest)
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,  # Size of each box in pixels
        border=4,  # Border size in boxes
    )
    
    # Add data to QR code
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create image
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save image
    output_path = os.path.join(output_dir, f"{filename}.png")
    img.save(output_path)
    
    print(f"✓ QR code created: {output_path}")
    return output_path

def batch_create_qr_codes(urls, output_dir="qr_codes"):
    """
    Create QR codes for multiple URLs.
    
    Args:
        urls (list): List of URLs to convert
        output_dir (str): Directory to save QR codes
    
    Returns:
        list: Paths to all created QR codes
    """
    created_files = []
    
    print(f"\nGenerating QR codes for {len(urls)} URLs...\n")
    
    for i, url in enumerate(urls, 1):
        try:
            filename = f"qr_code_{i}"
            path = create_qr_code(url, filename, output_dir)
            created_files.append(path)
        except Exception as e:
            print(f"✗ Error creating QR code for {url}: {e}")
    
    print(f"\n✓ Successfully created {len(created_files)} QR codes in '{output_dir}' folder")
    return created_files

# Example usage
if __name__ == "__main__":
    # Single URL example
    print("=== Single URL Example ===")
    create_qr_code("https://drive.google.com/file/d/1ijRyZjxUNnKREGje5eGVtGLKJnxLYKAY/view?usp=sharing")
    
