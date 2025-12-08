---
title: "jekyll"
layout: archive
permalink: /categories/jekyll/
author_profile: true
sidebar:
  nav: "docs"
---

{% assign category = "jekyll" %}
{% assign posts = site.categories[category] %}

<div class="entries-list">
  {% for post in posts %}
    {% include archive-single.html type="list" %}
  {% endfor %}
</div>
