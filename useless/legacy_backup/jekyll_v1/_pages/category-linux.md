---
title: "Linux"
layout: archive
permalink: /categories/linux/
author_profile: true
sidebar:
  nav: "docs"
---

{% assign category = "Linux" %}
{% assign posts = site.categories[category] %}

<div class="entries-list">
  {% for post in posts %}
    {% include archive-single.html type="list" %}
  {% endfor %}
</div>
