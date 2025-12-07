---
title: "Projects"
layout: archive
permalink: /categories/projects/
author_profile: true
sidebar:
  nav: "docs"
---

{% assign category = "Projects" %}
{% assign posts = site.categories[category] %}

<div class="entries-list">
  {% for post in posts %}
    {% include archive-single.html type="list" %}
  {% endfor %}
</div>
