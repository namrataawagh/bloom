# LifeOS --- Product Requirements & Build Specification

> **Product vision:** A personal life dashboard that helps one person
> build a fulfilling life beyond any single relationship. It combines
> journaling, habit tracking, goal management, planning, and memory
> keeping.
>
> **Core philosophy:** Build a life you enjoy living, not just a life
> you're trying to optimise.

This document is the implementation brief for building **LifeOS** in
Antigravity. Treat it as the source of truth for product scope, UX, data
model, and acceptance criteria.

------------------------------------------------------------------------

## 1. Product overview

### 1.1 Purpose

LifeOS helps the user intentionally invest in the different areas of
their life:

-   Personal growth and hobbies
-   Career and ambition
-   Friendships and social life
-   Health and fitness
-   Mental and emotional well-being
-   Finance and personal independence
-   Experiences and memories
-   Goals and planning

The app should encourage consistency, curiosity, connection, and
self-awareness without making the user feel guilty for missed habits or
unproductive days.

### 1.2 Product principles

1.  **Progress, not perfection.** Missed days must never be framed as
    failure.
2.  **Life before metrics.** Metrics support reflection; they do not
    define the user's worth.
3.  **Low-friction capture.** Journaling and logging an activity should
    be quick.
4.  **Personal and private.** This is a personal space. Do not expose
    entries publicly.
5.  **Flexible tracking.** Users can choose what to track and how often.
6.  **Encourage balance.** Show activity across life areas without
    ranking the user's value.
7.  **No relationship surveillance.** The app tracks the user's own
    actions, feelings, boundaries, and growth---not a partner's
    behaviour.
8.  **Useful, not overwhelming.** Keep the dashboard calm and prioritise
    a small number of actions.

### 1.3 Target platform

Build a responsive web application that works well on desktop, tablet,
and mobile.

### 1.4 Primary user

A single individual using the app as a private life-management and
reflection tool. The first version does not need multi-user
collaboration or social features.

------------------------------------------------------------------------

## 2. Information architecture and navigation

Use a persistent sidebar on desktop and a compact bottom navigation or
menu on mobile.

### Main navigation

1.  **Dashboard**
2.  **Personal & Hobbies**
3.  **Career**
4.  **Friendships**
5.  **Health**
6.  **Mind & Emotions**
7.  **Finance**
8.  **Memories**
9.  **Goals & Planning**
10. **Journal**
11. **Calendar**
12. **Insights / Reports**
13. **Settings**

The dashboard should provide shortcuts to the most-used actions: add a
task, log a habit, write a journal entry, record an activity, and add a
goal.

------------------------------------------------------------------------

## 3. Dashboard --- My Life at a Glance

The dashboard is the home page and should answer: "What matters today,
and how am I doing across my life?"

### 3.1 Header

-   Current date and day
-   Personalised greeting
-   Optional daily affirmation or thought
-   Quick-add actions

### 3.2 Today's overview

Display:

-   Today's tasks and priorities
-   Today's habit checklist
-   Upcoming events and commitments
-   Current goals and next actions
-   Quick journal-entry shortcut
-   Mood check-in
-   Daily highlight prompt: **"What did I do for myself today?"**

### 3.3 Weekly overview

Show:

-   Habits completed this week
-   Activities logged this week
-   Time invested in selected activities, if the user tracks duration
-   Goals/tasks progressed
-   Upcoming plans

Avoid presenting a single productivity score as the main measure of
success.

### 3.4 Life balance overview

Show a visual summary of these life areas:

-   Personal growth
-   Career
-   Friendships
-   Health
-   Emotional well-being
-   Finance
-   Experiences

Use neutral visual indicators such as activity counts, recent updates,
or user-defined goals. Do not label areas as "bad" or "failing" because
they have less activity.

### 3.5 Dashboard customisation

Allow users to:

-   Reorder or hide dashboard widgets
-   Choose which habits appear on the dashboard
-   Pin favourite goals
-   Set a preferred greeting or affirmation
-   Choose a compact or expanded layout

------------------------------------------------------------------------

## 4. Personal Life & Hobbies

This section helps the user discover interests, explore new activities,
and build a personal identity outside work or relationships.

### 4.1 Hobby discovery tracker

Users can create hobby records with:

-   Hobby name
-   Category
-   Why I want to explore it
-   Date added / date started
-   Status: Interested, Exploring, Regular, Paused, or Completed
-   Time spent (optional)
-   Personal rating: "How much did I enjoy this?"
-   Notes and reflections
-   Related photos or attachments (optional)

Suggested categories:

-   Creative: painting, sketching, photography, writing
-   Intellectual: reading, language learning, research
-   Physical: tennis, swimming, dancing, hiking
-   Lifestyle: cooking, baking, gardening
-   Exploration: solo dates, cafes, workshops, travel
-   Digital: video editing, design, blogging, personal websites

### 4.2 Things I want to try

A flexible bucket list for experiences such as:

-   Visit a new cafe alone
-   Attend a workshop
-   Try pottery
-   Go on a solo outing
-   Learn a new recipe
-   Join a sports club
-   Attend a book club

Each item can have a status: To try, Planned, Tried, or Not for me.
Allow notes and a date tried.

### 4.3 Personal projects

Track independent projects with:

-   Project title and description
-   Why it matters
-   Start date and target date
-   Status
-   Milestones and tasks
-   Notes, links, and attachments
-   Completion reflection

### 4.4 Personal interests library

Maintain lists of:

-   Books to read
-   Movies and documentaries to watch
-   Podcasts to listen to
-   Music to discover
-   Topics to research
-   Places to visit

Allow users to add a short note, category, link, and status.

------------------------------------------------------------------------

## 5. Career & Ambition

This section supports professional development, learning, and long-term
ambition.

### 5.1 Career goals

Support short-term and long-term goals, including:

-   Placement preparation
-   Internship applications
-   Skills to acquire
-   Certifications and courses
-   Projects to complete
-   Portfolio development
-   Interview preparation

Each goal should support a reason, target date, milestones, next action,
status, and progress notes.

### 5.2 Skill development tracker

For each skill, track:

-   Skill name
-   Current proficiency (user-defined scale)
-   Target proficiency
-   Learning resources
-   Hours invested (optional)
-   Projects or exercises completed
-   Notes and progress updates

Allow skills to be grouped into learning tracks.

### 5.3 Daily career tracker

Optional activity types:

-   Study / focused learning
-   Coding practice
-   Technical reading
-   Project work
-   Interview preparation
-   Course or certification work
-   Applications and networking

Allow duration, date, notes, and related skill or goal to be recorded.

### 5.4 Career achievements

Maintain a timeline of:

-   Completed projects
-   Certificates
-   Hackathons
-   Competitions
-   Interviews
-   Internships
-   Milestones and recognitions

Each achievement can include a date, description, links, attachments,
and reflection.

------------------------------------------------------------------------

## 6. Friendships & Social Life

This section should help the user nurture existing friendships and make
room for meaningful social experiences. It must not become a scorecard
of who contacts whom.

### 6.1 People in my life

Allow the user to maintain private contact notes for:

-   Friends
-   College friends
-   Old friends
-   Family
-   People they would like to reconnect with

For each person, optionally store:

-   Name or nickname
-   Relationship category
-   Birthday or important date
-   Interests or things they have mentioned
-   Personal notes
-   Last meaningful catch-up date
-   Upcoming plan

Do not require contact details or sensitive personal information.

### 6.2 Connection reminders

Optional reminders to:

-   Check in with a friend
-   Reply to a message
-   Arrange a catch-up
-   Remember a birthday
-   Follow up on something important they shared

The user controls whether reminders are enabled and how often they
appear.

### 6.3 Social bucket list

Examples:

-   Meet a friend one-on-one
-   Organise a group outing
-   Attend an event
-   Make a new friend
-   Reconnect with someone
-   Try an activity with friends

### 6.4 Weekly social reflection

Prompts:

-   Did I initiate any conversations?
-   Did I make time for someone?
-   Did I genuinely listen?
-   Did I enjoy spending time with people?
-   Is there someone I would like to reconnect with?

Keep this reflective and non-judgmental.

------------------------------------------------------------------------

## 7. Health & Fitness

This section helps the user take care of their body without encouraging
obsessive tracking.

### 7.1 Physical fitness

Track optional activities:

-   Workouts
-   Running
-   Walking
-   Sports and recreational activities
-   Strength training
-   Yoga or mobility

For each activity, support date, duration, activity type, optional
distance or notes, and linked fitness goal.

Show weekly activity frequency and trends where useful.

### 7.2 Nutrition

Optional tracking:

-   Daily meals
-   Water intake
-   Protein intake
-   Calorie intake (optional and off by default)
-   Meal planning
-   Food discoveries

Do not make calorie tracking mandatory. Keep nutrition tracking flexible
and supportive.

### 7.3 Self-care

Optional routines:

-   Skincare
-   Haircare
-   Personal grooming
-   Sleep schedule
-   Rest days

Allow habits to be scheduled by selected days rather than requiring
daily completion.

### 7.4 Health journal

Allow the user to record:

-   Energy levels
-   General mood and physical well-being
-   Sleep quality and duration
-   Menstrual cycle notes (optional, private, and off by default)
-   General observations

This is a personal wellness log, not a medical diagnosis or treatment
tool.

------------------------------------------------------------------------

## 8. Mind & Emotions

This section supports self-awareness, emotional regulation, and
reflection.

### 8.1 Daily mood tracker

Offer simple mood labels, for example:

-   Happy
-   Calm
-   Anxious
-   Sad
-   Irritated
-   Lonely
-   Overwhelmed
-   Excited

Allow multiple feelings, intensity (optional), and a short note. Mood
history should be viewable by day, week, and month.

### 8.2 Daily journal

Provide a free-writing editor and optional prompts:

-   What happened today?
-   What made me happy?
-   What bothered me?
-   What am I grateful for?
-   What did I learn about myself?
-   What could I have handled differently?

Allow users to save drafts, edit past entries, add tags, and optionally
attach photos.

### 8.3 Emotional pattern reflection

Use a structured entry with:

-   What triggered me?
-   What did I feel?
-   What story did I tell myself?
-   How did I react?
-   What did I need in that moment?
-   What could I try differently next time?

Example: If the user's partner goes out with friends, the user can
reflect on their own feelings and choices without monitoring or
recording the partner's behaviour.

### 8.4 Self-development

Maintain personal notes for:

-   Things I want to improve
-   Things I'm proud of
-   Personal boundaries
-   Affirmations
-   Lessons learned
-   Things I need to let go of

### 8.5 Independence tracker

Optional reflection prompts:

-   Did I spend time alone?
-   Did I do something without involving my partner?
-   Did I make a decision independently?
-   Did I respect someone else's independence?
-   Did I manage an uncomfortable emotion without trying to control
    someone else?

Track the user's own actions only. Never score, monitor, or evaluate a
partner.

------------------------------------------------------------------------

## 9. Finance & Personal Independence

A lightweight personal finance area.

### 9.1 Money overview

Support:

-   Monthly budget
-   Income
-   Expenses
-   Savings
-   Emergency fund
-   Personal spending
-   Financial goals

### 9.2 Expense tracking

Allow a user to add an expense with:

-   Amount
-   Date
-   Category
-   Description
-   Payment method (optional)
-   Notes

Suggested categories: Food, Transport, Education, Shopping, Health,
Entertainment, Travel, Savings, and Other.

### 9.3 Financial goals

Examples:

-   Save for a trip
-   Build an emergency fund
-   Save for a course or device
-   Set a monthly savings target

### 9.4 Wishlist

Maintain a list of things the user wants to buy, with estimated cost,
priority, and optional savings goal.

Include a section titled **"Things I want to afford independently."**

This module is a personal planning aid, not financial advice. Do not
connect bank accounts in the first version.

------------------------------------------------------------------------

## 10. Experiences, Memories & Bucket List

This section makes sure the app is about living, not only productivity.

### 10.1 Experiences log

Record:

-   Places visited
-   Restaurants and cafes explored
-   Solo dates
-   Trips and travel
-   New experiences
-   Favourite memories
-   Events attended

Each entry can include date, title, location (optional), description,
photos, people involved (optional), tags, and a favourite toggle.

### 10.2 Memory timeline

Display memories chronologically, with filters by month, year, category,
or tag.

### 10.3 Bucket list

Allow users to create life experiences they want to have, assign
categories, and mark them as planned, completed, or no longer
interested.

### 10.4 Favourite moments

Provide a quick way to save a moment with a photo and one or two
sentences.

------------------------------------------------------------------------

## 11. Goals & Planning

This section connects the rest of the app.

### 11.1 Goal management

Each goal should have:

-   Goal title
-   Life category
-   Description
-   Why this goal matters to me
-   Start date
-   Target date (optional)
-   Action steps / milestones
-   Progress status
-   Notes and reflections

Suggested statuses: Not started, In progress, Paused, Completed, and
Archived.

Allow goals to link to habits, tasks, skills, hobbies, and projects.

### 11.2 Weekly planner

Include:

-   Weekly priorities
-   Habits to maintain
-   Activities planned
-   Friends to meet
-   Skills to work on
-   Personal activities
-   Weekly reflection

### 11.3 Monthly review

At the end of each month, offer prompts:

1.  What did I accomplish?
2.  What new things did I try?
3.  How did I nurture my friendships?
4.  What did I learn?
5.  What did I neglect?
6.  What made me genuinely happy?
7.  What do I want to change next month?

Allow the user to save and revisit past reviews.

### 11.4 Tasks and to-dos

Tasks should support:

-   Title and description
-   Due date (optional)
-   Category / life area
-   Priority (optional)
-   Status
-   Recurrence (optional)
-   Linked goal (optional)

Keep task management simple. Avoid turning every personal activity into
a task.

------------------------------------------------------------------------

## 12. Journal

The Journal should also be accessible as a standalone navigation item.

### Core capabilities

-   Create, edit, and delete entries
-   Autosave drafts
-   Rich text or Markdown-style basic formatting
-   Date and time
-   Tags
-   Optional mood association
-   Optional life-area association
-   Optional photos or attachments
-   Search entries
-   Filter by date, tag, mood, and category
-   Calendar view of entries

Suggested entry types:

-   Free writing
-   Daily reflection
-   Gratitude
-   Emotional reflection
-   Weekly review
-   Monthly review
-   Memory

Make writing feel calm and distraction-free.

------------------------------------------------------------------------

## 13. Calendar

Provide a unified calendar that can show:

-   Tasks and deadlines
-   Habit schedules
-   Planned hobbies and activities
-   Social plans
-   Workouts
-   Events and experiences
-   Goal milestones
-   Reminders

Support month, week, and agenda views. Allow the user to filter by life
area and hide categories they do not want to see.

A calendar event should be editable and linkable to a goal, task, or
activity where relevant.

------------------------------------------------------------------------

## 14. Insights & Reports

The insights area should help the user notice patterns, not judge
themselves.

### 14.1 Weekly report

Summarise:

-   Habits completed
-   Activities logged
-   Time invested, if tracked
-   Journal entries written
-   Goals or milestones progressed
-   Social activities recorded
-   Favourite moment of the week

### 14.2 Monthly report

Summarise:

-   Activity across life areas
-   Habit consistency trends
-   Goals progressed or completed
-   New hobbies explored
-   Experiences recorded
-   Mood patterns, if the user tracks mood
-   User's monthly reflection

### 14.3 Visualisations

Useful charts include:

-   Habit completion by week
-   Activity time by category
-   Goal progress
-   Mood history
-   Monthly activity timeline

Do not combine different life areas into a score that implies the user
is succeeding or failing at life. Make charts optional and explain what
they represent.

------------------------------------------------------------------------

## 15. Additional features

Consider these features after the core product is working:

  -----------------------------------------------------------------------
  Feature                             Description
  ----------------------------------- -----------------------------------
  Habit streaks                       Show consistency while allowing
                                      rest days and missed days without
                                      shame

  Life calendar                       Combine plans, tasks, habits, and
                                      events

  Progress charts                     Show weekly and monthly trends

  Daily check-in                      Record mood, energy, and priorities

  Random activity generator           Suggest an activity from the user's
                                      own hobby and bucket lists

  Idea vault                          Save ideas and things to explore

  Photo journal                       Store memories with entries

  Weekly report                       Summarise activity and progress

  Personal milestones                 Celebrate achievements

  Notifications                       Remind users about selected habits
                                      and plans

  Global search                       Find journal entries, goals,
                                      activities, and memories
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 16. Special feature: "My Life Outside My Relationship"

Create a dedicated, optional dashboard card or page with this title.

Its purpose is to remind the user of the many parts of their identity
and life. It is not a relationship scorecard and should not encourage
emotional distancing.

Include:

-   Things I enjoy doing alone
-   People I want to maintain connections with
-   Goals that are entirely mine
-   Experiences I want to have
-   Things I want to learn
-   Moments when I felt genuinely happy independently
-   Things I'm proud of myself for

Include a daily prompt:

> **What did I do today that was just for me?**

The user can answer this as a short text entry and optionally link it to
a hobby, activity, goal, or memory.

------------------------------------------------------------------------

## 17. Design direction and visual language

### 17.1 Overall aesthetic

Create a warm, calm, modern, personal, and slightly editorial interface.
It should feel like a beautiful digital journal rather than a corporate
project-management dashboard.

Suggested direction:

-   Soft neutral backgrounds: warm off-white, cream, or very light beige
-   Muted sage or dusty green as a primary accent
-   Subtle secondary accents such as muted lavender, pale peach, or warm
    grey
-   Dark charcoal text for readability
-   Rounded cards and restrained borders
-   Gentle shadows used sparingly
-   Comfortable spacing and clear typography
-   Small, tasteful icons
-   Subtle transitions and micro-interactions

Avoid:

-   Loud neon colours
-   Excessive gradients
-   Dense dashboards
-   Too many charts on the home page
-   Gamification that shames missed days
-   Overly childish illustrations
-   Excessive badges or streak warnings

### 17.2 Layout

**Desktop** - Left sidebar navigation - Main content area - Optional
right-side panel for today's priorities or upcoming events - Responsive
card grid

**Mobile** - Compact top bar - Bottom navigation for the most-used
destinations - Scrollable cards - Large, accessible touch targets -
Quick-add button - Forms that work comfortably on small screens

### 17.3 Interaction design

-   Make common actions possible in one or two steps.
-   Use clear empty states that suggest a useful first action.
-   Provide undo or confirmation for destructive actions.
-   Use inline editing where practical.
-   Autosave journal drafts.
-   Keep forms short and group advanced fields under optional sections.
-   Provide helpful validation and success feedback.
-   Respect reduced-motion preferences.

### 17.4 Accessibility

-   Use semantic HTML and accessible labels.
-   Ensure sufficient text/background contrast.
-   Support keyboard navigation.
-   Do not rely on colour alone to communicate status.
-   Provide visible focus states.
-   Make charts understandable with text summaries.

------------------------------------------------------------------------

## 18. Data model --- suggested entities

Use a relational data model or an equivalent well-structured persistence
layer. The following are suggested entities; adapt field names to the
chosen stack.

### User

-   id
-   display_name
-   timezone
-   created_at
-   preferences

### LifeArea

-   id
-   user_id
-   name
-   icon
-   colour
-   sort_order
-   is_visible

### Habit

-   id
-   user_id
-   life_area_id
-   name
-   description
-   frequency / selected_days
-   start_date
-   end_date (optional)
-   reminder_time (optional)
-   is_active
-   created_at

### HabitLog

-   id
-   habit_id
-   date
-   status: completed, skipped, or not_done
-   note (optional)

### JournalEntry

-   id
-   user_id
-   title (optional)
-   content
-   entry_type
-   entry_date
-   mood (optional)
-   life_area_id (optional)
-   tags
-   created_at
-   updated_at

### Goal

-   id
-   user_id
-   life_area_id
-   title
-   description
-   why_it_matters
-   start_date
-   target_date (optional)
-   status
-   progress (optional)
-   created_at
-   updated_at

### GoalMilestone

-   id
-   goal_id
-   title
-   due_date (optional)
-   is_completed
-   completed_at (optional)

### Task

-   id
-   user_id
-   life_area_id
-   goal_id (optional)
-   title
-   description
-   due_date (optional)
-   priority (optional)
-   status
-   recurrence (optional)
-   created_at

### Activity

-   id
-   user_id
-   life_area_id
-   activity_type
-   title
-   date
-   duration_minutes (optional)
-   notes
-   rating (optional)
-   related_goal_id (optional)

### Hobby

-   id
-   user_id
-   name
-   category
-   reason_to_explore
-   status
-   started_at (optional)
-   personal_rating (optional)
-   notes

### BucketListItem

-   id
-   user_id
-   life_area_id (optional)
-   title
-   category
-   status
-   planned_date (optional)
-   completed_date (optional)
-   notes

### ContactNote

-   id
-   user_id
-   display_name
-   relationship_category
-   important_date (optional)
-   last_catch_up (optional)
-   notes

### MoodLog

-   id
-   user_id
-   date
-   mood_labels
-   intensity (optional)
-   energy_level (optional)
-   note (optional)

### Memory

-   id
-   user_id
-   title
-   description
-   date
-   location (optional)
-   tags
-   is_favourite

### Expense

-   id
-   user_id
-   amount
-   date
-   category
-   description
-   notes (optional)

### Reminder

-   id
-   user_id
-   related_entity_type
-   related_entity_id
-   scheduled_at
-   is_enabled
-   recurrence (optional)

### Attachment

-   id
-   user_id
-   related_entity_type
-   related_entity_id
-   file_url or storage_key
-   file_name
-   mime_type
-   created_at

Use foreign keys, ownership checks, indexes for common filters, and
timestamps where appropriate. The signed-in user must only be able to
access their own records.

------------------------------------------------------------------------

## 19. Privacy, security, and data handling

LifeOS contains personal reflections and potentially sensitive notes.
Treat privacy as a core product requirement.

-   Require authentication if the app is deployed for personal use
    beyond a local prototype.
-   Enforce server-side ownership checks for every user-owned record.
-   Never expose private entries through public URLs.
-   Use secure session handling.
-   Validate and sanitise user input.
-   Use secure file storage for attachments.
-   Do not send journal content or mood data to third-party analytics.
-   Do not use personal content to train models.
-   Do not add AI analysis of journal entries unless it is explicitly
    requested and separately consented to.
-   Provide export and account/data deletion options.
-   Avoid collecting unnecessary personal information.
-   Keep secrets and API keys out of client-side code and source
    control.

For an initial local prototype, use a simple persistence layer, but
structure the application so secure authentication and database-backed
storage can be added cleanly.

------------------------------------------------------------------------

## 20. Suggested technical implementation

Choose a maintainable modern web stack and explain the choice before
implementation.

Suggested approach:

-   Frontend: React with TypeScript
-   Styling: Tailwind CSS or an equivalent consistent design system
-   Components: reusable accessible UI components
-   Icons: Lucide or another consistent icon library
-   Charts: a lightweight chart library only where useful
-   Persistence: a relational database such as PostgreSQL, or
    local-first storage for an initial prototype
-   Backend: a typed API or backend-as-a-service with proper access
    controls
-   Forms: schema-based validation
-   Date handling: timezone-aware dates and recurrence logic

Do not over-engineer the first release. Keep the data model modular and
the UI components reusable.

------------------------------------------------------------------------

## 21. Build plan and priorities

### Phase 1 --- Functional MVP

Build these first:

1.  App shell, responsive navigation, and visual design system
2.  Dashboard
3.  Life areas
4.  Habit creation and daily habit logging
5.  Journal with date-based entries
6.  Goal creation and progress tracking
7.  Activity logging
8.  Basic calendar / agenda
9.  Settings and data persistence

**MVP acceptance criteria**

-   User can create, edit, complete, pause, and archive habits.
-   Habit schedules support selected days of the week.
-   User can log a habit for a date and see past logs.
-   User can create, edit, search, and delete journal entries.
-   Journal entries are associated with dates and can have tags.
-   User can create goals under life areas and update their progress.
-   User can log activities and optionally record duration.
-   Dashboard reflects saved data rather than hard-coded sample values.
-   Data remains available after refresh or app restart.
-   Layout is usable on mobile and desktop.
-   Empty states guide the user to create their first habit, goal, or
    entry.

### Phase 2 --- Life management

Add:

-   Hobby discovery tracker
-   Personal projects
-   Friendships and connection reminders
-   Health and fitness logs
-   Mood and emotional reflection
-   Bucket lists
-   Weekly planner
-   Unified calendar

### Phase 3 --- Reflection and insights

Add:

-   Weekly and monthly reports
-   Habit and activity charts
-   Memory timeline
-   Monthly reviews
-   Global search
-   Data export

### Phase 4 --- Optional enhancements

Add only after validating the core experience:

-   Notifications and reminders
-   Random activity suggestions
-   Dashboard customisation
-   Photo and attachment uploads
-   Advanced recurring schedules
-   Optional integrations

------------------------------------------------------------------------

## 22. Development instructions for Antigravity

Build this as a real, working application---not just a static mockup.

1.  First inspect the project directory and identify the existing
    framework, dependencies, and conventions. Do not overwrite existing
    work without understanding it.
2.  Before coding, propose a concise architecture and implementation
    plan based on the existing project.
3.  Implement the app in small, testable phases, starting with the MVP.
4.  Create reusable components for navigation, cards, forms, habit rows,
    journal entries, goal progress, and empty states.
5.  Use real application state and persistence. Do not use hard-coded
    dashboard numbers as if they were live data.
6.  Ensure every visible button and control performs its stated action.
7.  Add sensible loading, empty, validation, error, and success states.
8.  Test create, read, update, and delete flows for core entities.
9.  Test responsive layouts at mobile, tablet, and desktop widths.
10. Check keyboard accessibility and basic contrast.
11. Keep code organised by feature and document important setup steps.
12. If a feature is too large for the current phase, implement a clear,
    useful placeholder and document what remains. Do not make a
    non-functional control look complete.

### Important product constraints

-   Do not turn the app into a strict productivity or performance
    scoring system.
-   Do not punish missed habits or broken streaks.
-   Do not require users to track every life area.
-   Do not make calorie tracking or menstrual tracking mandatory.
-   Do not monitor a partner or use relationship activity as a metric.
-   Do not make the app socially competitive or public by default.
-   Keep the experience warm, encouraging, calm, and personal.

------------------------------------------------------------------------

## 23. Final product success criteria

LifeOS is successful if the user can:

-   See their day clearly without feeling overwhelmed.
-   Build and maintain habits that matter to them.
-   Explore hobbies and record what they enjoy.
-   Make progress towards career and personal goals.
-   Nurture friendships intentionally.
-   Take care of their physical and emotional well-being.
-   Reflect on feelings without judging themselves.
-   Record experiences and preserve memories.
-   See their growth over weeks and months.
-   Build a fulfilling life that is meaningful in its own right.

> **The central reminder of LifeOS:**
>
> "Your relationship can be a beautiful part of your life without being
> the entirety of it. Make room for your own interests, friendships,
> ambitions, experiences, and happiness."
