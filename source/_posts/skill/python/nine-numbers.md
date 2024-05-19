---
layout: post
title: 回溯法解九数字问题
date: 2024-05-18 22:47:15
tags: Python
categories: 技术杂谈
mathjax: true
---
## 问题再现

求一个九位数 $M$ ，已知 $M$ 的各位数由不重复的 $1\sim9$ 组成，对于 $m\in\{2,3,4,\cdots,9\}$ ，数 $M$ 左侧的 $m$ 位数都是 $m$ 的倍数。

## 解题思路

左侧 $m$ 的倍数，那么我们能否使用回溯法：从左侧开始，每次向右确定1位数，若从某一位数开始无法找到满足条件的前 $m$ 位数，则向左删除最后一位数并尝试其他值？这样，我们可以减少『无脑枚举』产生的大量无用值，更快地得到结果。

## 算法示例

```python
def check(prev_nums: list, number: int) -> bool:
    ''' 判断当前数位是否满足题目要求 '''

    # 当前数位的数字不能存在于前序数位中
    is_contained = (str(number) not in prev_nums)

    # 前k位数必须能被k整除
    is_zero = (
        (10 * int(''.join(prev_nums)) + number) % len(prev_nums) == 0
    )

    # 同时满足以上2个条件才为真
    return (is_contained and is_zero)


def search_num(prev_nums=['0']):
    ''' 递归搜索数值 '''

    # 遍历数字1～9
    for k in range(1, 10):
        # 检查是否满足要求
        if check(prev_nums, k):
            # 追加此数值
            prev_nums.append(str(k))

            # 如果已经求出了指定位数且满足条件的要求
            if len(prev_nums) - 1 == 9:
                # 返回最终的k位数
                return int(''.join(prev_nums))
            else:
                # 否则继续检索下一位
                temp = search_num(prev_nums)

                # 如果下一位存在可行数值
                if temp is not None:
                    # 返回下一位的检索结果
                    return temp

    # 当前数位没有可行结果，移除上一位，重新检索
    prev_nums.pop()


if __name__ == "__main__":
    ''' 主函数 '''
    print(search_num())
```
