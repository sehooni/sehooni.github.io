---
title: "DataStructure"
layout: archive
permalink: /categories/datastructure/
author_profile: true
sidebar:
  nav: "docs"
---

{% assign category = "DataStructure" %}
{% assign posts = site.categories[category] %}

<div class="entries-list">
  {% for post in posts %}
    {% include archive-single.html type="list" %}
  {% endfor %}
</div>
