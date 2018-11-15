# file system

## 侧边栏
内容在/_layout/default.html中编辑
小图标大小为32x32.png

?侧边栏图标用在线URL显示，否则无法在子页面显示

## 总标题
信息在_config.yml中修改

## 图标
{{ site.url }}/assets/icon/


## All posts
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>