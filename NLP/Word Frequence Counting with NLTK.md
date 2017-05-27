# Word Frequence Counting with NLTK

## Version info
Python 2.4 or 2.5 (test with 2.7)
NLTK2.0 (downward compatibility, test with 3.2.3)
Anaconda2 4.3

## Code
```python
from nltk.book import *
```


```python
text1
```


```python
text2
```


    <Text: Sense and Sensibility by Jane Austen 1811>



```python
text1.concordance("monstrous")
```

    Displaying 11 of 11 matches:
    ong the former , one was of a most monstrous size . ... This came towards us , 
    ON OF THE PSALMS . " Touching that monstrous bulk of the whale or ork we have r
    ll over with a heathenish array of monstrous clubs and spears . Some were thick
    d as you gazed , and wondered what monstrous cannibal and savage could ever hav
    that has survived the flood ; most monstrous and most mountainous ! That Himmal
    they might scout at Moby Dick as a monstrous fable , or still worse and more de
    th of Radney .'" CHAPTER 55 Of the Monstrous Pictures of Whales . I shall ere l
    ing Scenes . In connexion with the monstrous pictures of whales , I am strongly
    ere to enter upon those still more monstrous stories of them which are to be fo
    ght have been rummaged out of this monstrous cabinet there is no telling . But 
    of Whale - Bones ; for Whales of a monstrous size are oftentimes cast up dead u
    


```python
text1.similar("monstrous")
```

    imperial subtly impalpable pitiable curious abundant perilous
    trustworthy untoward singular lamentable few determined maddens
    horrible tyrannical lazy mystifying christian exasperate
    


```python
text2.similar("monstrous")
```

    very exceedingly so heartily a great good amazingly as sweet
    remarkably extremely vast
    


```python
text2.common_contexts(["monstrous", "very"])
```

    a_pretty is_pretty a_lucky am_glad be_glad
    


```python
text4.dispersion_plot(["citizens", "democracy", "freedom", "duties", "America"])
```


![png](output_7_0.png)



```python
text3.generate()
```


    ---------------------------------------------------------------------------

    TypeError                                 Traceback (most recent call last)

    <ipython-input-17-e0816ba18b61> in <module>()
    ----> 1 text3.generate()
    

    TypeError: generate() takes exactly 2 arguments (1 given)



```python
len(text3)
```




    44764




```python
sorted(set(text3))
```




    [u'!',
     ...
     u'A',
     u'Abel',
     u'Abelmizraim',
     ...
     u'coffin',
     u'cold',
     ...]




```python
len(set(text3))
```


    2789



```python
# average usage of each word 
from __future__ import division
len(text3) / len(set(text3))
```




    16.050197203298673




```python
text3.count("smote")
```




    5




```python
# usage percentage of a word
100 * text4.count('a') / len(text4)
```




    1.4643016433938312




```python
fdist1 = FreqDist(text1)
print(fdist1)
```

    <FreqDist with 19317 samples and 260819 outcomes>
    


```python
vocabulary1 = fdist1.keys()
print(vocabulary1[:50])
```

    [u'funereal', u'unscientific', u'divinely', u'foul', u'four', u'gag', u'prefix', u'woods', u'clotted', u'Duck', u'hanging', u'plaudits', u'woody', u'Until', u'marching', u'disobeying', u'canes', u'granting', u'advantage', u'Westers', u'insertion', u'DRYDEN', u'formless', u'Untried', u'superficially', u'vesper', u'Western', u'portentous', u'meadows', u'sinking', u'Ding', u'Spurn', u'treasuries', u'churned', u'oceans', u'powders', u'tinkerings', u'tantalizing', u'yellow', u'bolting', u'uncertain', u'stabbed', u'bringing', u'elevations', u'ferreting', u'wooded', u'songster', u'uttering', u'scholar', u'Less']
    


```python
fdist1['whale']
```




    906




```python
fdist1.plot(50, cumulative=True)
```


![png](output_18_0.png)

