# Try Code of Faster-RCNN

## Bug fixed

### To run the demo
>cd $FRCN_ROOT
>./tools/demo.py

* Bug:
Traceback (most recent call last):
  File "./tools/demo.py", line 21, in <module>
    import matplotlib.pyplot as plt
  File "/usr/lib64/python2.7/site-packages/matplotlib/pyplot.py", line 115, in <module>
    _backend_mod, new_figure_manager, draw_if_interactive, _show = pylab_setup()
  File "/usr/lib64/python2.7/site-packages/matplotlib/backends/__init__.py", line 32, in pylab_setup
    globals(),locals(),[backend_name],0)
  File "/usr/lib64/python2.7/site-packages/matplotlib/backends/backend_tkagg.py", line 6, in <module>
    from six.moves import tkinter as Tk
  File "/usr/lib/python2.7/site-packages/six.py", line 199, in load_module
    mod = mod._resolve()
  File "/usr/lib/python2.7/site-packages/six.py", line 113, in _resolve
    return _import_module(self.mod)
  File "/usr/lib/python2.7/site-packages/six.py", line 80, in _import_module
    __import__(name)
ImportError: No module named Tkinter

* Solution:
>sudo yum install tkinter

__From <https://stackoverflow.com/questions/36327134/matplotlib-error-no-module-named-tkinter>__
