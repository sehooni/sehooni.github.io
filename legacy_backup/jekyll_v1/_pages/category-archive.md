---
title: "Categories"
layout: single
permalink: /categories/
author_profile: true
---

<ul class="taxonomy__index">
  {% for category in site.categories %}
    <li>
      <a href="{{ '/categories/' | relative_url }}{{ category[0] | slugify }}/">
        <strong>{{ category[0] }}</strong> <span class="taxonomy__count">{{ category[1].size }}</span>
      </a>
    </li>
  {% endfor %}
</ul>
