---
title: "algorithms"
layout: archive
permalink: /categories/algorithms/
author_profile: true
sidebar:
  nav: "docs"
---

{% assign category = "algorithms" %}
{% assign posts = site.categories[category] %}

<div class="entries-list">
  {% for post in posts %}
    {% include archive-single.html type="list" %}
  {% endfor %}
</div>
