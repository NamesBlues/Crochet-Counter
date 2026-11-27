class Counter:
    def __init__(self):
        self.n = self.load()

    def load(self):
        try:
            return int(open("quanshu.txt").read())
        except FileNotFoundError:
            return 0

    def save(self):
        with open("quanshu.txt","w") as f:
            f.write(str(self.n))

    def add(self):
        self.n += 1
        self.save()
        return self.n

    def reset(self):
        self.n = 0
        self.save()

c = Counter()

while True:
    g = input("这圈钩完了吗？(y/n/q/r):")
    if g == "y":
        print(f"当前第{c.add()}圈")
    elif g == "n":
        print("请继续,别停!")
    elif g == "r":
        c.reset()
        print("已重置为0")
    elif g == "q":
        print("你怎么能退出QAQ好吧,给你退出,哼!")
        break