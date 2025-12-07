---
title: "DL"
layout: archive
permalink: /categories/dl/
author_profile: true
sidebar:
  nav: "docs"
---

{% assign category = "DL" %}
{% assign posts = site.categories[category] %}

<div class="entries-list">
  {% for post in posts %}
    {% include archive-single.html type="list" %}
  {% endfor %}
</div>
