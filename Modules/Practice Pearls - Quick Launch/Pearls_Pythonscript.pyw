from pywinauto.keyboard import send_keys
import pyperclip

send_keys('^C')
pearl = pyperclip.paste()
file_pearl = open("C:/ProgramData/Chuck/Scripts/Pearls.Rx", "w")
file_pearl.write(pearl)
file_pearl.close()

