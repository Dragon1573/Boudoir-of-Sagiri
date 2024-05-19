---
layout: post
title: 运算符即函数，偏函数和柯里化
date: 2024-05-18 22:31:25
tags:
  - Python
  - 函数式编程
categories: 技术杂谈
---

## 第1部分 - 运算符即函数

在 Python 中有大量的函数对象，但我们不能那么[^1]去使用它们，因为它们是方法或运算符之类的东西，需要通过一些额外的封装层才能把它们当函数使用。这并不是一个天大的难题，但用原生乘法运算符`*`来定义一个乘法函数还是挺奇怪的，因为我们无法直接以函数的形式来使用它。所幸，我们可以从 Python 的`operator`模块中获取方法、运算符之类的、真正的函数形式。比如，这是我们之前定义过的`mul()`和`add()`方法。

```python
from operator import add, mul


print(add(13, 7), mul(7, 6))
>>> 20 42
```

注意，因为它们都是 Python 内置运算符『真正的』函数形式，所有的重载都是支持的。也就是说，既然我们可以使用加法运算符去加和数字、拼接列表和字符串，我们就能用`operator`模块中相应的函数做同样的事情。

```python
print(add([1, 0], [1]))
print(mul('Err and ... ', 3))
>>> [1, 0, 1]
..| Err and ... Err and ... Err and ... 
```

但这还有更好玩的。例如，我们可以获取`mothodcaller`为一个函数。一旦你给它提供了想要调用的方法，它会返回这个方法的一个函数形式。如果这个函数拥有一些你希望指定的参数，你可以将它们写在`methodcaller`函数调用的特定方法名参数之后。作为结果，你会得到一个正好执行了相应方法和参数的函数。例如，这里我们使用`methodcaller`创建了一个`splitline`函数。

```python
from operator import methodcaller as method


splitline = method('split', '\n')
print(splitline("Don't\npanic"))
>>> ["Don't", 'panic']
```

`operator`模块包含了大量可以当函数使用的实用工具，我强烈建议你去访问位于 Python 文档网页上的 [软件包页面](https://docs.python.org/zh-cn/3/library/operator.html) 。

## 第2部分 - 偏函数

会想起这个例子，使用匿名函数去创建一个不需要一次性全部提供所有参数以产生结果，而是给定一个参数返回另一个需要其他参数来获得结果的函数。

```python
sep_mul = lambda a: lambda b: a * b
mul2 = sep_mul(2)
```

它意味着，我们可以获取一些通常情况下需要多个参数，但有一个（或多个）参数已经存在预设值的函数。这些函数被称为 **偏函数** 。要创建一个偏函数，我们可以像之前那样使用`lambda`关键字构造。但这还有更简便的方法，在`functools`模块中有个叫`partial`的函数，可以把一些函数作为它的首个参数、我们需要预先定义的参数作为后续参数来生成一个偏函数。这是一个以更易读的方式定义我们那个『乘以 $2$ 』偏函数的例子。

```python
from functools import partial


mul = lambda a, b: a * b
mul2 = partial(mul, 2)
print(mul2(3))
>>> 6
```

如果你注意过它的存在，偏函数是一个非常有用的工具。例如，假设你经常需要输出一些东西而不换行，但写这种`end=`的形式还是挺尴尬的。通过使用偏函数，我们可以任意地创建一个和`print`差不多但某些参数（比如`end=`）早已被预设的函数。

```python
printline = partial(print, end=' ')
printlast = partial(print, end='')
printline('B')
printline('C')
printline('K')
printlast('W')
>>> B C K W
```

## 第3部分 - 柯里化

假设我们有一个需要 $5$ 个参数的函数，而且我们希望它具有以下功能：我们希望它每次只需要 $1$ 个参数并返回至少应用了 $1$ 个参数[^2]的偏函数，而不是一次性提供 $5$ 个参数并返回结果。当然，其中一种怪异的实现方法是借助偏函数和λ表达式，但其实有专用的工具来应对这种情况。这类函数，也就是那些除了最后一次之外，需要一个一个提供参数并返回仅需一个参数的函数，被称为 **柯里化函数** ，而将多参数函数转换为柯里化函数的过程被称为 **柯里化** 。Python 的`toolz`模块包含了一个`curry`函数来实现它，让我们试试。

```python
from toolz import curry


def addFiveNums(a, b, c, d, e):
    return a + b + c + d + e


caddFiveNums = curry(addFiveNums)
print(caddFiveNums(1)(2)(3)(4))
print(caddFiveNums(1)(2)(3)(4)(5))
>>> <function <lambda> at 0x0126DC48>
..| 15
```

你可能也注意到了，`curry`可以当装饰器函数来使用。确实，它将某些函数作为输入、稍微改变了这个函数的行为而不实际改变这个函数的功能。这是一个非常使用的技巧，我们可以尽在定义一个函数的时候添加`@curry`装饰器来创建一个柯里化函数。在函数式编程中，柯里化是一个非常有用的、控制函数的工具。柯里化能够帮助我们解决的一个熟悉的问题是使用带参数的装饰器。回忆一下我们之前尝试简化定义带参装饰器的过程。

```python
def parameterized(decorator):
    def decoFunction(*dec_args, **dec_kwargs):
        def res_decorator(func):
            return decorator(func, *dec_args, **dec_kwargs)

        return res_decorator

    return decoFunction


@parameterized
def introduce5(func, n=1):
    @wraps(func)
    def inner(*args, **kwargs):
        print(('\n' + func.__name__) * n)
        return func(*args, **kwargs)

    return inner
```

我们定义了另一个名为`parameterized`的装饰器，它将用参数化装饰的初始装饰器转换为`decoFunction`，这个`decoFunction`给定了我们想要由初始装饰器使用的所有参数，并返回结果装饰器。这个结果装饰器将我们想要用初始装饰器装饰的函数返回到将初始装饰器应用到一系列参数的结果，其中函数首先运行，然后是初始装饰器的参数。这个应用程序模式与初始装饰器的定义相匹配。好吧，我们可以在不制作`parameterized`装饰器的情况下实现这一点。

为了获得类似的行为，我们需要做的仅仅是将初始装饰器柯里化并以下列方式定义它：功能装饰器参数在装饰器参数序列中排在最前面，然后是`func`参数。因此，我们看起来是参数化装饰器的函数将一个一个接收它的参数，类似于我们的`addFiveNums`所做的，并且在它接收所有装饰器的参数之后，它将返回一个实际的装饰器——一旦我们提供一个希望被装饰的函数，这个函数会返回最终结果。

```python
@curry
def introduce6(n, func):
    @wraps(func)
    def inner(*args, **kwargs):
        print(('\n' + func.__name__) * n)
        return func(*args, **kwargs)

    return inner


@introduce6(42)
def id6(x):
    """ Identify function """
    return x


print(id6(20))
>>> id6
..| id6
    <此处省略39行>
..| id6
..| 20
```

即使你想在定义装饰器函数时在参数序列中先写`func`，你也可以这样做，只是所有的装饰器参数都应该命名，并且你应该以适当的方式调用它们。

```python
@curry
def introduce6(func, n=1):
    # 具体实现和上面相同，此处省略
    pass


@introduce(n=42)
def id6(x):
    """ Identify function """
    return x
```

## 总结

在这一课中，我们讲解了如何将运算符变成函数以供调用，提到了 Python 内置的`operator`模块；我们讲解了『偏函数』的定义，提到了`functools`模块中的`partial`函数；我们还讲解了『柯里化』的定义，提到了`toolz`模块中的`curry`函数，回顾并化简了之前课程中有参装饰器的实现。

[^1]: 指像前面的课程一样作为参数进行传递。
[^2]: 除了最后一次调用，我们提供了用于计算结果的最后一个必要参数，并实际得到了计算结果。
