---
title: "PaperReview"
layout: archive
permalink: /categories/paperreview/
author_profile: true
sidebar:
  nav: "docs"
---

{% assign category = "PaperReview" %}
{% assign posts = site.categories[category] %}

<div class="entries-list">
  {% for post in posts %}
    {% include archive-single.html type="list" %}
  {% endfor %}
</div>
