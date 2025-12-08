---
title: "ETC"
layout: archive
permalink: /categories/etc/
author_profile: true
sidebar:
  nav: "docs"
---

{% assign category = "ETC" %}
{% assign posts = site.categories[category] %}

<div class="entries-list">
  {% for post in posts %}
    {% include archive-single.html type="list" %}
  {% endfor %}
</div>
