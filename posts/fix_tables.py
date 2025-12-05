import os

print("开始扫描并修复表格...")

# 遍历当前目录下的所有文件
for filename in os.listdir('.'):
    if not filename.endswith('.md'):
        continue

    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    fixed_count = 0

    for i, line in enumerate(lines):
        new_lines.append(line)
        
        # 核心判断逻辑：
        # 1. 当前行有竖线 | (是表格行)
        # 2. 上一行没有竖线 (说明这是表格的第一行/表头)
        # 3. 下一行没有 "---" (说明缺失分割线)
        
        current_has_pipe = '|' in line
        # 判断上一行是否存在且包含 |
        prev_has_pipe = False
        if i > 0:
            prev_line = lines[i-1].strip()
            if '|' in prev_line:
                prev_has_pipe = True
        
        # 判断下一行是否已经是分割线
        next_is_separator = False
        if i + 1 < len(lines):
            next_line = lines[i+1].strip()
            # 分割线特征：包含 | 和 ---
            if '|' in next_line and '---' in next_line:
                next_is_separator = True

        # 命中条件：是表头，且缺腰带
        if current_has_pipe and not prev_has_pipe and not next_is_separator:
            # 智能计算列数
            pipe_count = line.count('|')
            if pipe_count >= 2:
                # 生成逻辑：N个竖线，生成 N-1 个间隔
                # 例如 3个竖线 | A | B | -> 需要 |---|---|
                separator = '|' + '---|' * (pipe_count - 1) + '\n'
                new_lines.append(separator)
                fixed_count += 1

    if fixed_count > 0:
        with open(filename, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"✅ 在 {filename} 中修复了 {fixed_count} 个表格")

print("所有文件处理完成。")
