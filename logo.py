from PIL import Image
import os

def convert_non_transparent_to_white(input_path, output_path=None):
    """
    将PNG图片的非透明区域修改为白色
    
    参数:
        input_path: 输入图片的路径
        output_path: 输出图片的路径，若为None则在原文件名后加"_white"
    """
    # 打开图片
    try:
        img = Image.open(input_path)
    except Exception as e:
        print(f"无法打开图片: {e}")
        return
    
    # 确保图片是RGBA模式（包含Alpha通道）
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # 分离通道
    r, g, b, a = img.split()
    
    # 创建白色通道（255表示白色）
    white = Image.new('L', img.size, 255)
    
    # 合并通道：使用白色通道替换RGB通道，保留Alpha通道
    # 这样非透明区域(a>0)会显示白色，透明区域保持透明
    new_img = Image.merge('RGBA', (white, white, white, a))
    
    # 处理输出路径
    if output_path is None:
        # 生成默认输出路径
        dir_name, file_name = os.path.split(input_path)
        base_name, ext = os.path.splitext(file_name)
        output_path = os.path.join(dir_name, f"{base_name}_white{ext}")
    
    # 保存处理后的图片
    try:
        new_img.save(output_path)
        print(f"图片已保存至: {output_path}")
    except Exception as e:
        print(f"保存图片失败: {e}")

if __name__ == "__main__":
    # 示例用法
    input_image_path = "logo.png"  # 替换为你的输入图片路径
    convert_non_transparent_to_white(input_image_path)
