# Momentum — AP Physics C: Mechanics study site

A course-style learning site built around *Fundamentals of Physics* (12th ed.) and the 2024 AP Physics C: Mechanics equation sheet.

## Run it
Double-click **Start Physics Site.command** (or run `python3 -m http.server 8765 --directory site` and open http://localhost:8765).
It has to be served this way — YouTube embeds won't play if `index.html` is opened directly as a file.

## What's inside
- **14 chapters** (Ch. 1–13 and 15 of the book — the chapters the AP exam covers), **53 lessons**, each tied to its book module and starting page.
- **Videos:** 360+ real YouTube videos found by searching each lesson topic, plus textbook problem walkthroughs for each chapter.
- **Articles:** an original write-up for every lesson, with worked examples, common mistakes and equation-sheet callouts.
- **Practice:** 157 problem types with new numbers every attempt, hints, full worked solutions, and mastery levels (Attempted → Familiar → Proficient → Mastered) saved in your browser.
- **Models:** every problem has a "See a model of this problem" panel: an animated, interactive model with the problem's exact numbers, live readouts, graphs, what-if sliders, and a real-world photo (Wikimedia Commons, credited). Each lesson also has a Model lab.
- **Tests:** a quiz and unit test for each chapter, a 40-question final exam, and **Prepare me for my test**, which takes requests like "Make me a practice test for everything covered in chapter 7" (interactive or printable with an answer key).
- **Equation sheet:** the 2024 table of information, grouped by topic and linked to chapters.

## Files
- `site/index.html` — entry page
- `site/js/content/chXX.js` — articles + problem generators per chapter
- `site/js/models-*.js` — the interactive models
- `site/js/videos.js`, `site/js/photos.js` — the video and photo lists
