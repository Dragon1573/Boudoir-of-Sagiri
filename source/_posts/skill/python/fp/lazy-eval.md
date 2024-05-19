---
layout: post
title: Python中的惰性计算
date: 2024-05-18 22:34:21
tags:
  - Python
  - 函数式编程
categories: 技术杂谈
---

## 第1部分 - 迭代器

如果我们尝试直接打印`map`函数的结果而不将它们转换为列表，会发生什么呢？

```python
nums = ints(5)
it = map(lambda x: x ** 2, nums)
print(it)
>>> <map object at 0x01065C10>
# 原作者使用的解释器应该是32位的，地址长度为8位十六进制字符，
# 64位解释器输出的地址应该是16位字符十六进制字符。
```

没什么特别的，它只是告诉我们目前正在操作的对象是个映射对象而不是列表，我还提到过这些对象仍然是可迭代的。在 Python 中，想要让一个对象可迭代，它需要支持所谓的 **迭代器接口** 。**迭代器** 是一类支持了特性函数的特殊对象，如果我们可以借助`iter`函数从中获得一个迭代器，那么这个对象就是可迭代的。特别地，当你在一个迭代器上调用`iter`函数，你会获得这个迭代器自身作为结果，所以迭代器对象是可迭代的。

```python
list = [1, 2, 3]
it = iter(list)
print(it)
>>> <list_iterator object at 0x00FD3690>

print(iter(it))
>>> <list_iterator object at 0x00FD3690>
```

或许你已经猜到了，在第6课中提到的`map`、`filter`和其他对象其实都是迭代器，我们可以放心地将一个迭代器视为一系列支持少数关键函数的对象。其中一个函数是`next`函数，这个函数返回迭代器的当前元素，并将迭代器移动到其内部序列的下一个元素位置。

```python
print(next(it))
>>> 1
```

让我解释一下，迭代器是一种序列，我们可以借助`next`函数向后移动但没法往回移动。这意味着，如果我们对一个迭代器调用`next`函数，它包含的元素就变少了。比如，假设我们在多次调用`next`函数后将迭代器转换为一个列表，得到的结果会比我们从未调用过`next`函数那时更短。一旦我们像迭代器里仍有元素那样多次调用`next`函数到达了迭代器末尾，继续调用`next`函数会触发`StopIteration`异常。

让我们用尽这个`map`对象迭代器，看看将它转换为列表时究竟会发生什么（记住，我们已经多次调用了`next`函数）。

```python
for _ in range(4):
    next(it)
l = list(it)
print(l)
>>> []
```

另一件需要知道的事情是，对迭代器调用`list`之类的函数会将其元素用尽，也就是说，会取出其所有的元素。那是因为这类函数会遍历提供给它的所有对象，如果你对一些可遍历对象而不是迭代器自身进行遍历，这是实际发生的情况：这个可遍历对象的一个迭代器会通过`iter`函数被创建，随后进行后续的处理过程。但如果你对一个迭代器进行遍历，将不会有任何迭代器副本产生，你实际上会遍历其所有的元素并将迭代器的元素耗尽。所以，不要在将迭代器转换为列表之后继续使用迭代器，那会触发`StopIteration`异常，不论迭代器在调用转换前还剩下多少个元素。

```python
it = iter([2, 3, 4, 5, 6])
next(it)
>>> 2

list(it)
>>> [3, 4, 5, 6]

next(it)
>>> Traceback (most recent call last):
..|     File "<stdin>", line 1, in <module>
..| StopIteration:
```

## 第2部分 - 生成器

为了更好地了解发生了什么，我们可以创建自定义迭代器。为此，我们需要定义一个 **生成器函数** 。生成器函数本质上是一个使用了`yield`语句的函数。

```python
def intSeq(n):
    i = 0
    while i < n:
        yield i
        i += 1


seq = intSeq(5)
```

之所以被叫做『生成器』，是因为它依次生成了迭代器中的元素。所以，迭代器是生成器函数执行的结果。正因如此，`seq`是一个迭代器，`intSeq`是一个生成器函数。如你所见，这个`yield`语句有点像`return`语句，但它不会终止函数执行而是暂时中断它一会儿（直到`next`函数调用被执行），然后函数会从中断的位置继续运行。

比如，这个`intSeq`函数与在单参函数`range`的结果上调用`iter`函数是差不多的：它提供 $0$ ，然后是 $1$ ，接着是 $2$ ，以此类推，直到我们到达 $n-1$ ，即`intSeq`生成的迭代器的最后一个元素。

```python
print(next(seq))
>>> 0

for i in seq:
    print(i)
>>> 1
..| 2
..| 3
..| 4

next(seq)
>>> Traceback (most recent call last):
..|     File "<stdin>", line 1, in <module>
..|     File "<string>", line 1, in <module>
..|     File "<string>", line 956, in <module>
..| StopIteration:
```

正如你所看到的，当我们遍历它时，迭代过程从 $1$ 开始，因为我们已经在之前调用了`next`并将 $0$ 移除了。在遍历了迭代器中所有元素之后，调用`next`函数触发了一个异常。在调用`list`函数隐式遍历迭代器之后尝试调用`next`函数也是一样的。

```python
seq = intSeq(5)
print(list(seq))
next(seq)

>>> [0, 1, 2, 3, 4, 5]
..| Traceback (most recent call last):
..|     File "<stdin>", line 1, in <module>
..|     File "<string>", line 1, in <module>
..|     File "<string>", line 964, in <module>
..| StopIteration:
```

让我们看看这个生成器函数的另一种实现，它通过在需要时人为抛出`StopIteration`异常来模拟前一个生成器的行为。

```python
def intSeq2(n):
    i = 0
    while True:
        yield i
        i += 1
        if i >= n:
            raise StopIteration()


seq2 = intSeq2(5)
for i in seq2:
    print(i)
next(seq2)

>>> 0
..| 1
..| 2
..| 3
..| 4
..| Traceback (most recent call last):
..|     File "<stdin>", line 1, in <module>
..|     File "<string>", line 1, in <module>
..|     File "<string>", line 981, in <module>
..| StopIteration:
```

我们也可以在生成器函数中使用`return`语句，这与抛出`StopIteration`异常时相同的：一旦生成器的执行到达了`return`语句，就意味着迭代器将不再产生任何元素，所以再次调用`next`函数是个坏主意。

```python
def intSeq3(n):
    i = 0
    while True:
        yield i
        i += 1
        if i >= n:
            return


seq3 = intSeq3(5)
for i in seq3:
    printline(i)

>>> 1 2 3 4
```

我们本可以放心地认为`return`和`StopIteration`在设计生成器函数上下文中做了相同的事情，但显然不是。考虑这个例子：

```python
def generator():
    try:
        yield 'fun'
        raise StopIteration()
    except:
        yield 'glory'


gen = generator()
print(next(gen), '/', next(gen))
>>> fun / glory
```

由于我们抛出了一个异常，它会被`try-excepts`结构捕获，所以我们的生成器函数会提供 $2$ 个值。如果我们改写为`return`，那么将不会有异常被捕获，生成的迭代器将在只提供 $1$ 个值后被耗尽。

## 第3部分 - 错误示例

下面是这些玄学出现的例子：假设我们有一个数字列表，我们想计算它们平方的均值。当然，平方计算部分很简单。

```python
from functools import partial


squares = partial(map, square)
```

现在，我们可能想要编写一个计算结果的函数。

```python
avg = lambda seq: sum(seq) / len(seq)
res = lambda seq: avg(squares(seq))
```

但`squares`函数返回一个迭代器，尽管`sum`函数在迭代器上起作用了，但`len`函数并没有。所以我们需要编写自己的长度函数，这个函数应在迭代器上起作用（或者将`squares`的结果转换为列表，但我们不希望这样做是有原因的）。我们可以在迭代器上执行映射，将每个元素都变成 $1$ ，随后计算这个结果序列的和，或者也可以像下面这样写。

```python
from toolz import compose


constOne = lambda _: 1
length = compose(sum, partial(map, constOne))
```

让我们试试。

```python
res([1, 2, 3])
>>> ZeroDivisionError: division by zero
```

这对你们中的一些人来说可能是出乎意料的。那么，发生甚么事了？好吧，除法执行的唯一位置在`avg`函数体内。因此，我们自己的`length`函数由于某些原因返回了 $0$ 。

```python
length([1, 2, 3])
>>> 3
```

现在问题变得很明显了。

```python
i = it([1, 2, 3])
sum(i)
>>> 6
length(i)
>>> 0
```

这只是因为我们在`avg`中使用了 $2$ 个函数，它们都会遍历整个迭代器。因此有2种可能的解决方案（如果我们依旧认为将`squares`的结果转换为列表是个坏方案）。首先，我们可能以某种方式创建两个相同但相互独立的迭代器：一个传入`sum`而另一个传入`length`。但是，最好是在一次迭代器遍历中同时追踪两个值，而不是分别为它们执行两次遍历。我们可能有一个以总和为首元素、以长度为次元素的元组，并在我们每次遍历迭代器的时候同时修改这两个值。

```python
from operator import truediv as div


avg = lambda seq: div(*reduce(lambda t, xs: (t[0] + xs, t[1] + 1), seq, (0, 0)))
print(res([1, 2, 3]))
>>> 4.666666666666667
```

## 第4部分 - 我为什么要用这些东西？

好吧，这其实是一种在 Python 中完成迭代的『暗盒』实现。出于某些原因，为了遍历一个列表，构建这样一个奇怪的迭代器可能会更加方便。但为什么我们需要从类似于`map`、`filter`、`accumulate`、`chain`之类的函数中返回这种奇怪的对象？毕竟，它们中的个别函数在 Python 2.x 中返回列表。而且我们为什么需要深入这种神仙实现的细节？真正的情况是，这是一种在 Python 中让我们的计算变得『懒惰』的方法。如你所见，这些生成器函数随着它们的执行在按需产生数值，它们并没有为需要提供的整个元素序列分配空间。这是的我们的计算能够更加高效，并完成一些真正整洁的事情。

考虑一下这个函数：

```python
def numbers():
    n = 0
    while True:
        yield n
        n += 1
```

你看不到函数体中的循环停止条件，因为我们根本不需要。这个函数生成所有非负整数序列。但因为迭代器是惰性的，它并不会尝试去计算涵盖的整个序列，它并不需要这样。他会在我们运行过程中需要时生成结果并提供给我们。

```python
N = numbers()
next(N)
>>> 0
next(N)
>>> 1
next(N)
>>> 2
next(N)
>>> 3
```

事实上，`map`、`filter`之类的所有函数返回迭代器而不是列表，让我们能够处理这种无限序列但不丢失惰性。例如，我们可以用这种方法获得所有非负整数的平方。

```python
squares = map(square, numbers())
next(squares)
>>> 0
next(squares)
>>> 1
next(squares)
>>> 4
next(squares)
>>> 9
```

这种构造方式被称为 **生成器构造法** ，它和 **列表构造法** 相似，除了它返回一个迭代器，所以结果是惰性的。

```python
evens = (n for n in numbers() if not n % 2)
next(evens)
>>> 0
next(evens)
>>> 2
next(evens)
>>> 4
```

顺便提一句，如果你将一个可解释的迭代器作为某个函数唯一的参数，括号可以被省略。

## 第5部分 - 惰性 itertools

现在让我们看看`itertools`模块中用于处理可遍历对象和迭代器的其他函数。

```python
from itertools import tee, count, cycle, repeat, islice
```

`tee`创建了迭代器的两个独立副本，『独立』意味着遍历其中一个不会改变另一个。如果你想要创建更多的副本，你可以将需要的副本数量作为`tee`函数的可选参数进行指定。这是一个有用的东西，因为在不同处理过程中共用一个迭代器是个坏主意。

```python
N = numbers()
next(N)
>>> 0
next(N)
>>> 1
next(N)
>>> 2

S = map(square, N)
next(S)
>>> 9
```

`count`不过是一个和我们`numbers`生成器相当的生成器，即它返回一个从 $0$ 开始的无限整数序列迭代器。它有两个可选参数：计数的起点和终点。

`cycle`传入一个可遍历对象，返回一个无限重复其中元素的迭代器。

```python
oneTwoThrees = cycle([1, 2, 3])
for _ in range(5):
    print(next(oneTwoThrees))

>>> 1
..| 2
..| 3
..| 1
..| 2
```

`repeat`传入一个元素，并返回无限重复此元素的迭代器，就像只有一个元素的`cycle`。

```python
AAAAA = repeat('A')
for _ in range(5):
    print(next(AAAAA))

>>> A
..| A
..| A
..| A
..| A
```

`islice`是一个列表切片的惰性版本。它与非惰性版本的工作原理几乎相同，除了它是一个函数，适用于任何可遍历对象并返回一个生成器。你必须指定获取切片的可遍历对象来源、如果你制定了一个额外的可选参数，它会被当作切片终点；如果有两个可选参数，则按顺序分别视为起点和终点。如果你只想指定起点，可以将终点设置为`None`。最后，如果你制定了第 $3$ 个额外参数，那么它会被当作切片步长，不能设置负数步长。

```python
firstEventSquares = lambda n: islice(squares, 0, n, 2)
print(list(firstEvenSquares(5)))
>>> [0, 4, 16]
```

## 第6部分 - send 与 yield from

让我们看看生成器函数另外两个非常重要的功能。首先，`yield`表达式可以双向传递信息。除了从生成器中获得值，我们还可以向它传入值。比如这个`counter`：

```python
def counter():
    cnt = 0
    while True:
        new = yield cnt
        print('New:', new)
        if new:
            cnt = new
        else:
            cnt += 1
```

它和我们之前定义的`numbers`函数功能基本相同，不过现在我们不仅在`yield`关键字右侧有一个我们需要输出的变量，它还是一个赋值语句。

这意味着，我们可以使用一种特殊的`send`方法去设置`yield`关键字左侧的值，例如，我们想要把`counter`重新设置为$0$。

需要注意的是，当我们`send`一些东西时，`yield`语句不但会设置`new`变量的值，还会将这个东西作为生成器函数当前的输出结果。还要注意，如果我们调用`next`函数但没有`send`任何值，那么`new`变量会自动变为`None`，这也是它的`if`分支为什么会在我们没有将`new`变量显式设置为`None`或 $0$ 时仍能运行的原因。

```python
c = counter()
next(c)
>>> 0

next(c)
>>> New: None
..| 1

next(c)
>>> New: None
..| 2

next(c)
>>> New: None
..| 3

c.send(1)
>>> New: 1
..| 1

next(c)
>>> New: 2
..| 2
```

这太棒了，但它并不是一个函数式编程语言该有的。

还有一个更强大的——`yield from`构造。考虑一下这个有限制的`counter`生成器函数，我希望它的作用是明确的。

```python
def limCounter(n):
    cnt = 0
    while cnt < n:
        new = yield cnt
        if new:
            cnt = new
        else:
            cnt += 1
```

现在，让我们通过将生成器用在某些参数上，来创建两个独立的迭代器。让我们做一个新的生成器函数，它会首先遍历第 $1$ 个迭代器，在用尽后遍历第 $2$ 个迭代器。这正是`yield from`语句让我们做到的。这不仅是遍历一些迭代器的一种构造，我们实际上还将上下文切换为了我们正在`yield from`的迭代器。这说明，我们可以把数值`send`给它，就像我们将值的生成委托给了这个迭代器一样。

```python
def doubleLimCounter():
    yield from limCounter(5)
    yield from limCounter(7)


d = doubleLimCounter()
next(d)
>>> 0
next(d)
>>> 1
next(d)
>>> 2
next(d)
>>> 3
next(d)
>>> 4
d.send(2)
>>> 2
next(d)
>>> 3
next(d)
>>> 4
next(d)
>>> 0
next(d)
>>> 1
next(d)
>>> 2
d.next(1)
>>> 1
next(d)
>>> 2
```

## 第7部分 - 我们自己的工具箱

现在，我们知道了如何让我们处理的事物保持惰性，让我们从函数式编程工具箱中定义一些非常常见的函数。

首先，使用`drop`和`take`函数是很常见的，它让我们更易于使用而不是每次都在需要的时候显式使用`islice`。

```python
take = lambda n, it: islice(it, 0, n)
drop = lambda n, it: islice(it, n, None)
```

此外，`head`和`tail`也被大量使用，我们希望他们能直接与迭代器进行惰性计算。

```python
head = partial(take, 1)
tail = partial(drop, 1)
```

有时，我们想要强制触发计算。这与获取一些惰性切片并在其上调用`list`构造方法是绝对同义的，但最好是定义这么一个函数来提醒我们它实际做了什么。强制触发计算并将结果存储在列表中可能会占用相当多的资源。

```python
force = compose(list, islice)
```

还有一个非常有用的函数叫做`iterate`。它传入一个函数 $f$ 和一些元素 $x$ ，然后返回一个无限序列，其首元素是 $x$ 、第二个是  $f(x)$、第三个是 $f(f(x))$ ，以此类推。一个可能的实现像下面这样：

```python
def iterate(f, x):
    yield x
    yield from iterate(f, f(x))
```

但这有一个递归调用，因此我们被限制到只能获取约一千个元素。所以，最好是避免使用递归，因为`iterate`一般是用来生成大型序列的。

```python
from itertools import accumulate


iterate = lambda f, x: accumulate(repeat(x), lambda a, b: f(a))
```

在这里，我们生成了一个无限序列，它的首元素是 $x$ ，然后我们通过`accumulate`直接忽略第 $2$ 个参数并将当前元素定义为函数 $f$ 应用于第 $1$ 个元素的结果，而不是对两个连续的元素做点什么。如果你无法完全理解它是怎么做到的，请考虑复习一下本系列中关于列表处理函数的课程。

当然，这也有少量的、琐碎的应用。下面是一个演示`iterate`函数如何使用的例子，让我们看看`numbers`函数的第二种实现：

```python
numbers2 = iterate(inc, 0)
```

它本质上是相同的，因为它返回一个从 $0$ 开始的序列，然后是将`inc`函数应用到 $0$ 的结果（也就是 $1$ ），接着是将`inc`函数应用于`inc(0)`的结果（也就是`inc(1)`，即 $2$ ）。

顺便说一句，我们可以借助`zero`函数作为初始值、`successor`函数作为迭代函数，生成在λ表达式那一课中介绍的『邱琦数字』。

```python
numerals = iterate(succ, zero)
next(numerals)(f)(x)
>>> 0
next(numerals)(f)(x)
>>> 1
next(numerals)(f)(x)
>>> 2
next(numerals)(f)(x)
>>> 3
next(numerals)(f)(x)
>>> 4
next(numerals)(f)(x)
>>> 5
```

## 第8部分 - 一些重要的例子

下面是另一个使用这些工具的例子。你可能熟悉这种技术，即通过给定的数字序列系统地生成质数，将序列中的第 $1$ 个元素定义为素数，然后过滤掉之后所有能被它整除的数字，从而得到一个筛子序列，再将相同的过程应用于筛子序列。它被称为 **埃拉托色尼筛子**（也就是 **埃氏筛** ）。以下正好是这个递归算法的生成器函数表示法。

```python
def eratoSieve(seq):
    currentPrime = next(seq)
    yield currentPrime
    sieved = filter(lambda x: x % currentPrime != 0, seq)
    yield from eratoSieve(sieved)


primes = eratoSieve(count(2))
next(primes)
>>> 2
next(primes)
>>> 3
next(primes)
>>> 5
next(primes)
>>> 7
```

我们可以利用惰性计算的事实，从而向函数传入一个从 $2$ 开始的无限整数序列，计算结果是一个包含无限质数序列的迭代器。当然，我们无法使用这个方法生成所有质数，至少是因为 Python 中关于嵌套递归调用的限制，抑或是由于内存本身有限，但它仍能很好地发挥作用。如果你难以理解这个生成器函数的任何一个部分，请回顾本课程中关于`yield`和`yield from`语句的部分。

我们可以使用类似的技术来实现斐波那契数列生成器的规范 Haskell 版本。我们利用这样一个事实，即如果我们写下一个`fibs`序列，然后紧接着写下从第 $2$ 个元素开始的相同序列，那么对这两个序列相应元素的求和会得到从第 $3$ 个元素开始的原始`fib`序列。

```python
def fibs():
    yield 1
    yield 1
    fibs1, fibs2 = tee(fibs())
    yield from zipWith(sum)(fibs1, tail(fibs2))


f = fibs()
next(f)
>>> 1
next(f)
>>> 1
next(f)
>>> 2
next(f)
>>> 3
next(f)
>>> 5
next(f)
>>> 8
next(f)
>>> 13
next(f)
>>> 21
next(f)
>>> 34
```

以下是正在发生的事情的粗略可视化表达。这个想法是，通过对`fibs1`的首元素和`fibs2`的首元素（也就是`fibs1`的第$2$个元素）进行求和，根据定义我们会得到`fibs1`的第 $3$ 个元素，同时也是`fibs2`的第 $2$ 个元素。这个元素会被添加到一般的`fibs`序列中（因为它是下一个斐波那契数），因此它会同时被附加到`fibs1`和`fibs2`的末尾。但是，由于我们对`fibs1`和`fibs2`的首元素进行了求和，我们每在这两个序列上调用一次`next`函数，这两个序列都会同时向后移动一个元素。因此，我们可能需要再次重复此过程：对这两个序列的首元素进行求和并同时获得这两个序列的下一项，然后同时将这两个序列移动到下一项。这只会在我们使用惰性计算，且`zipWith`函数能应用在那些需要时可以自我构建的结构上才有效。如果你愿意，在这张图片里，红色表示当前步骤中这些元素已经被调用了`next`函数。

:::center
![](https://ucarecdn.com/93ae6c08-0697-4594-838a-3f6aba8b6c68/)
:::

我们可能将这些技术应用于另一种任务。计算问题解决方法中有一个共同的模式，称为 **增量改进** 。这个想法是，我们通过反复改进我们的估计来逼近解决方案。我们说，我们在改善近似，直至 **收敛** 。收敛一般意味着我们两个连续的估计『足够接近』。『足够接近』以不同的方式进行定义，当答案是数值时，它一般表示两个近似值的绝对误差小于某个预定义值。

让我们来看看一个简单的例子。你可能会熟悉 **级数展开** 的概念，级数展开是一个函数以无限求和形式的表达，其形式取决于这个函数的参数。这个求和会收敛为函数的值。级数展开是计算某些函数近似值的绝佳工具：我们可以对其求和到特定项并获得答案，答案的精度取决于我们求和的项数。当然，我们并不需要无限精度。因此，我们可以定义一个阈值，然后开始累计各项到结果中。如果我们在某一个步骤中，我们的近似值变化小于阈值，我们可以认为答案已经足够精确。

比如，这是 $e^x$ 的级数展开：
$$
e^x=\sum_{i=0}^{\infty}{\frac{x^i}{i!}}=1+x+\frac{x^2}{2}+\cdots
$$
让我们实现一个生成器，返回此函数的近似序列，在满足收敛条件时结束。

```python
def inc_improve(seq, eps):
    def convergeTest(prev, curr):
        if abs(prev - curr) < eps:
            raise StopIteration
        else:
            return curr

    return accumulate(seq, convergeTest)


def expSeries(x):
    i = 1
    res = 1
    term = 1
    while True:
        yield res
        term *= (x / i)
        i += 1
        res += term


eSeq = inc_improve(expSeries(1), 1e-15)
for app in eSeq:
    print(app)

>>> 1
..| 2.0
..| 2.5
..| 2.6666666666666665
..| 2.708333333333333
..| 2.7166666666666663
..| 2.7180555555555554
..| 2.7182539682539684
..| 2.71827876984127
..| 2.7182815255731922
..| 2.7182818011463845
..| 2.718281826198493
..| 2.7182818282861687
..| 2.7182818284467594
..| 2.71828182845823
..| 2.718281828458995
..| 2.718281828459043
..| 2.7182818284590455


from math import e
print(e)
>>> 2.718281828459045
```

它工作得很好，非常快，而且它提供了我们希望观察到的生成整个序列的方法。这种特定的程序可以被泛化，从而适应更多类似的计算问题。

## 总结

在这最后一课里，我们详细讲解了 Python 的惰性计算。在前 4 个部分，我们介绍了迭代器和生成器，并说明了这两种工具的实用意义；在第 5～7 部分，我们讲解了 *itertools* 中涉及惰性计算的相关函数，介绍了`send`和`yield from`句式，并借助它们实现了属于我们自己的惰性计算工具箱；在最后的第 8 部分，我们借助埃氏筛、斐波那契数列和级数展开逼近这 3 个例子，讲解了惰性求值的重要性。
