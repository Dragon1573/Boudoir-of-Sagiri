---
layout: post
title: Pdb命令行调试器
date: 2024-05-18 23:05:56
tags:
  - Python
categories: 技术杂谈
---

总结自 [@码农高天](https://space.bilibili.com/245645656) 的视频 [BV1La4y1T7Y5](https://www.bilibili.com/video/BV1La4y1T7Y5?vd_source=3e7f43a8180ada8939dbf7b1ab006608) ，非原创内容！

## 简介

`pdb` 是 Python 官方提供的命令行调试器。开发者执行 debug 的目标，是为了知道**代码此时在干什么**。

任何 debugger 的两大核心功能：

1. 在开发者关心的位置暂停程序运行
2. 暂停时检视程序状态

## 示例

### 对源代码完全可控

当开发者对需要调试的源代码具有控制权时，可以在代码中直接添加 `breakpoint()` 打断点。

```python
def g(data):
    return data * data


def f(x):
    breakpoint()
    array = []
    for i in range(x):
        val = g(i)
        array.append(val)
    return array


f(3)
```

运行代码后会自动进入 Pdb 调试界面。

```
(cpy3.10) 19:58:49 ~/D/Python 1ms $ python main.py
> /home/dragon1573/Documents/Python/main.py(7)f()
-> array = []
(Pdb)
```

其中：

- 第2行开头的一长串内容 `/home/dragon1573/Documents/Python/main.py` 是当前执行文件的绝对路径，`(7)` 表示当前处于文件的第7行，`f()` 表示当前代码逻辑在此函数当中
- 第3行表示即将执行的源代码
- 第4行的 `(Pdb)` 前缀表示你已经进入了调试状态

#### 检视程序状态

- `p` 或者 `print` ，打印变量或任意合法 Python 表达式的值。优先从当前的栈帧查找变量

  ```
  (Pdb) p x
  3
  ```

- `w` 或者 `where` ，查看程序调用栈。第4行开头的 `>` 指向当前栈帧
  ::: warning
  Python 调用栈为从上至下调用，从上至下逐层深入。
  :::

  ```
  (Pdb) w
    /home/dragon1573/Documents/Python/main.py(14)<module>()
  -> f(3)
  > /home/dragon1573/Documents/Python/main.py(7)f()
  -> array = []
  ```

- `l` 或者 `lst` ，查看当前位置的11行关联上下文（前后各5行）

  ```
  (Pdb) l
    2         return data * data
    3  
    4  
    5     def f(x):
    6         breakpoint()
    7  ->     array = []
    8         for i in range(x):
    9             val = g(i)
   10             array.append(val)
   11         return array
   12  
  ```

  多次执行 `l` 命令，每次向后滚动11行， `l .` 回到当前行的上下文。

- `ll` 或 `longlst` ，打印当前函数的完整源代码

  ```
  (Pdb) ll
    5     def f(x):
    6         breakpoint()
    7  ->     array = []
    8         for i in range(x):
    9             val = g(i)
   10             array.append(val)
   11         return array
  ```

- `u` 或 `up` ，切换到上层调用栈帧

  ```
  (Pdb) u
  > /home/dragon1573/Documents/Python/main.py(14)<module>()
  -> f(3)
  ```

- `d` 或 `down` ，切换到下层调用栈帧

  ```
  (Pdb) d
  > /home/dragon1573/Documents/Python/main.py(7)f()
  -> array = []
  ```

#### 控制程序运行

- `n` 或 `next` ，运行一行源代码

  ```
  (Pdb) n
  > /home/dragon1573/Documents/Python/main.py(8)f()
  -> for i in range(x):
  ```

- `s` 或 `step` ，进入函数调用

  ```
  (Pdb) s
  --Call--
  > /home/dragon1573/Documents/Python/main.py(1)g()
  -> def g(data):
  ```

  ::: warning
  `n` 与 `s` 只在当前行有函数或方法调用时才存在区别！

  `n` 跳过函数调用内部逻辑，直接求值并到达下一行，`s` 则进入函数内部逻辑。
  :::

-  `retval` ，提示函数即将返回的时候获取函数返回值

  ```
  (Pdb) s
  --Return--
  > /home/dragon1573/Documents/Python/main.py(2)g()->0
  -> return data * data
  (Pdb) retval
  0
  ```

- `until` ，快进到当前行号之后的最近可断点位置，可以快进跳过循环逻辑

  ```
  (Pdb) w
    /home/dragon1573/Documents/Python/main.py(14)<module>()
  -> f(3)
  > /home/dragon1573/Documents/Python/main.py(10)f()
  -> array.append(val)
  (Pdb) until
  > /home/dragon1573/Documents/Python/main.py(11)f()
  -> return array
  ```

  `until <arg>` 可以直接快进到指定的行

  ```
  (cpy3.10) 20:29:58 ~/D/Python 2ms $ python main.py
  > /home/dragon1573/Documents/Python/main.py(7)f()
  -> array = []
  (Pdb) until 11
  > /home/dragon1573/Documents/Python/main.py(11)f()
  -> return array
  ```

- `r` 或 `return` ，快进到函数返回点

  ```
  (cpy3.10) 20:32:01 ~/D/Python 2ms $ python main.py
  > /home/dragon1573/Documents/Python/main.py(7)f()
  -> array = []
  (Pdb) r
  --Return--
  > /home/dragon1573/Documents/Python/main.py(11)f()->[0, 1, 4]
  -> return array
  ```

- `c` 或 `continue` ，继续执行到下一个断点，没有后续断点则持续执行到结束退出

  ```
  (cpy3.10) 20:39:11 ~/D/Python 2ms $ python main.py
  > /home/dragon1573/Documents/Python/main.py(7)f()
  -> array = []
  (Pdb) c
  (cpy3.10) 20:39:14 ~/D/Python 1.6s $
  ```

### 执行任意 Python 语句

在 `pdb` 中，开发者可以执行任意合法 Python 语句，甚至包括变量的运行时赋值。

```
(cpy3.10) 20:34:40 ~/D/Python 2.62min $ python main.py                                 ✘ 1
> /home/dragon1573/Documents/Python/main.py(7)f()
-> array = []
(Pdb) n
> /home/dragon1573/Documents/Python/main.py(8)f()
-> for i in range(x):
(Pdb) p array
[]
(Pdb) array = [1, 2, 3]
(Pdb) until 10
> /home/dragon1573/Documents/Python/main.py(10)f()
-> array.append(val)
(Pdb) n
> /home/dragon1573/Documents/Python/main.py(8)f()
-> for i in range(x):
(Pdb) p array
[1, 2, 3, 0]
```

### 无控制权的源代码调试

在开发者调用标准或第三方库函数时，一般的 `print()` 输出中间变量值的调试方法已不再可行。需要知道标准或第三方库内部的运行过程时，只有借助 `pdb` 来完成调试检视。

1. 在自己可控的源代码中加入断点 `breakpoint()` ，通过 `s` 命令跟踪进入标准或第三方库的源代码

2. 不修改任何源代码，用 `python -m pdb` 启动执行，`pdb` 将在源代码首个可断点位置自动暂停

   ```python
   def g(data):
       return data * data
   
   
   def f(x):
       array = []
       for i in range(x):
           val = g(i)
           array.append(val)
       return array
   
   
   f(3)
   ```

   ```
   (cpy3.10) 20:39:14 ~/D/Python 1.6s $ python -m pdb main.py 
   > /home/dragon1573/Documents/Python/main.py(1)<module>()
   -> def g(data):
   (Pdb)
   ```

#### 设置断点

`b` 或 `breakpoint` 后跟行号作为参数，可以在指定的行添加断点。

```
(Pdb) ll
  1  -> def g(data):
  2         return data * data
  3  
  4  
  5     def f(x):
  6         array = []
  7         for i in range(x):
  8             val = g(i)
  9             array.append(val)
 10         return array
 11  
 12  
 13     f(3)
(Pdb) b 6
Breakpoint 1 at /home/dragon1573/Documents/Python/main.py:6
```

不添加参数，则列出当前所有的断点。

```
(Pdb) b
Num Type         Disp Enb   Where
1   breakpoint   keep yes   at /home/dragon1573/Documents/Python/main.py:6
```

继续执行， `pdb` 将在断点处自动暂停。

```
(Pdb) c
> /home/dragon1573/Documents/Python/main.py(6)f()
-> array = []
```

在设置断点的时候，还可以将函数名称作为参数，在函数入口处打断点。

```python
import inspect


def g(data):
    return data * data


def f(x):
    array = []
    for i in range(x):
        _ = inspect.currentframe()
        val = g(i)
        array.append(val)
    return array


f(3)
```

```
(cpy3.10) 21:10:41 ~/D/Python 1ms $ python -m pdb main.py
> /home/dragon1573/Documents/Python/main.py(1)<module>()
-> import inspect
(Pdb) b inspect.currentframe
Breakpoint 1 at /usr/lib/python3.10/inspect.py:1672
(Pdb) c
> /usr/lib/python3.10/inspect.py(1674)currentframe()
-> return sys._getframe(1) if hasattr(sys, "_getframe") else None
(Pdb) w
  /usr/lib/python3.10/bdb.py(597)run()
-> exec(cmd, globals, locals)
  <string>(1)<module>()
  /home/dragon1573/Documents/Python/main.py(17)<module>()
-> f(3)
  /home/dragon1573/Documents/Python/main.py(11)f()
-> _ = inspect.currentframe()
> /usr/lib/python3.10/inspect.py(1674)currentframe()
-> return sys._getframe(1) if hasattr(sys, "_getframe") else None
(Pdb) ll
1672B   def currentframe():
1673        """Return the frame of the caller or None if this is not possible."""
1674 ->     return sys._getframe(1) if hasattr(sys, "_getframe") else None
```

#### 退出调试

`q` 或 `quit` 可以从当前位置强制终止运行并退出调试状态。

在使用 `breakpoint()` 语句和 `python main.py` 进入调试状态后， `pdb` 会在执行 `q` 命令退出时抛出异常。

```
(Pdb) q
Traceback (most recent call last):
  File "/home/dragon1573/Documents/Python/main.py", line 14, in <module>
    f(3)
  File "/home/dragon1573/Documents/Python/main.py", line 7, in f
    array = []
  File "/home/dragon1573/Documents/Python/main.py", line 7, in f
    array = []
  File "/usr/lib/python3.10/bdb.py", line 90, in trace_dispatch
    return self.dispatch_line(frame)
  File "/usr/lib/python3.10/bdb.py", line 115, in dispatch_line
    if self.quitting: raise BdbQuit
bdb.BdbQuit
(cpy3.10) 20:58:23 ~/D/Python 1.38s $                                     ✘ 1
```

#### 删除断点

`clear` 命令删除所有的断点，添加参数指定需要具体删除的断点编号。

```
(Pdb) clear 1
Deleted breakpoint 1 at /usr/lib/python3.10/inspect.py:1672
(Pdb) clear
Clear all breaks? yes
```
