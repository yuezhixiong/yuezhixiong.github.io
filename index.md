---
layout: default
comments: false
---

# Welcome

Try to get the most out of my Ph.D. at University of Technology Sydney and Southern University of Science and Technology.

## Last update
{{ site.time }}

## PhD toolbox
<ul>
  {% for post in site.tags.PhD %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>

## Visualization toolbox
<ul>
  {% for post in site.tags.viz %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>