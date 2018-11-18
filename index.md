---
layout: default
comments: false
---

# Welcome

Try to get the most out of my Ph.D.

## Last update
{{ site.time }}

## All posts
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>