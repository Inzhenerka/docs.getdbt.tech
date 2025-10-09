---
title: "Coalesce dbt Fusion Engine in Platform Quickstart Guide"
id: "coalesce-fusion-platform-qs"
# time_to_complete: '30 minutes' commenting out until we test
level: 'Beginner'
icon: 'zap'
hide_table_of_contents: true
tags: ['dbt Fusion engine', 'dbt Platform','Quickstart']
recently_updated: true
---

## Introduction

Get hands-on with the dbt Fusion Engine in a sandbox dbt Platform account during Coalesce. **This Quickstart guide is only intended to be used by in-person Coalesce registered users.**

Continue this guide to get hands on keyboards or preview the experience in the video below.

<div>
<iframe src="https://fast.wistia.net/embed/iframe/8w1n1xeqo9?web_component=true&seo=true&videoFoam=false" title="Coalesce Fusion Sandbox Walkthrough Video" allow="autoplay; fullscreen" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" width="840px" height="460px"></iframe>
<script src="https://fast.wistia.net/player.js" async></script>
</div>

## Section 1: Sandbox Sign-up

Let's get started with access to a Fusion Sandbox!

<Lightbox src="/img/guides/coalesce-fusion-qs/workshop-form.png" width="90%" title="The form for accessing your Fusion Sandbox in dbt Platform." />

1. Go to [https://workshops.us1.dbt.com/workshop](https://workshops.us1.dbt.com/workshop) (Note: In order to access the sign-up page, you may need to log out of any existing dbt Platform account you have or access this URL in Incognito Mode)

2. Enter your first name, last name, and company email.

3. From the dropdown, select **Mom’s Flower Shop** as your workshop.

4. Enter the passcode provided on the Fusion @ Coalesce website (linked via the QR code in your welcome bag).

5. Click **Complete Registration** and note your temporary email and password.   
   
   💡 *Accounts remain active for 7 days, but you must use the temporary email / password provided to you after registration to access the account. Store this on a notepad doc or password manager for the week.*	  

6. Click **Login**  

## Section 2: Developer Productivity with Fusion

1. In the left navigation, click **Select a project** and choose **Mom’s Flower Shop**

2. In the left hand navigation, click on **Studio** to open the Fusion-enabled IDE.

3. An in-app guide will appear for quick resources and videos about Fusion’s new capabilities. Please take a few minutes to review these resources\!

4. From the File Explorer in **Studio,** open models/staging/stg\_flower\_orders.sql.

5. Use **Preview CTE** above the first CTE to preview data for a just this CTE (raw\_flower\_orders)  
   
   💡 *Fusion enables modular previews for faster debugging.*  

6. Hover the asterisk in select \* to see column names and data types of available columns.   
   
<Lightbox src="/img/guides/coalesce-fusion-qs/select-star.png" width="90%" title="💡 Fusion provides live metadata and column insights as you code." />

7. Test Fusion’s live error detection — introduce a typo and click **Save**. (e.g., change order\_id to order\_key) to see real-time feedback. Hover over the red squiggly line to see details about the error.

<Lightbox src="/img/guides/coalesce-fusion-qs/sql-error.png" width="90%" title="Fusion can detect your SQL errors in real-time while you code and before you send it to your data platform." />

    Please note: any file edits stay local to your Studio IDE; no feature branches are permitted for this sandbox account.

## Section 3: State-Aware Orchestration

1. From the left navigation, go to **Orchestration → Environments → Production**.

2. Navigate to **Prod Job (State Aware Orchestration Enabled)** at the bottom of the page.

3. Open **Settings** to validate that State-Aware Orchestration is already enabled for this job.

<Lightbox src="/img/guides/coalesce-fusion-qs/toggle-sao.png" width="90%" title="SAO is easily enabled through the familiar job configurations view." />

4. Navigate back to the job page by clicking on the **Prod Job (State Aware Orchestration Enabled)** in the breadcrumb path above the Run \#. 

<Lightbox src="/img/guides/coalesce-fusion-qs/return-to-job.png" width="90%" title="Navigate back to the job itself through the breadcrumb." />

5. Click “Run Now” on the **Prod Job (State Aware Orchestration Enabled)** and click into the run to view logs.  

<Lightbox src="/img/guides/coalesce-fusion-qs/prod-job-settings.png" width="90%" title="Choose the run now button to kick off the initial SAO run." />

6. After completion, open the **Lineage** tab.  
    
    All models should show **Success**, since this is the first full run of the project. 

7. Run the job again by clicking **Run Now** again to see the power of State Aware Orchestration at work\!

8. When the job completes, open the **Lineage** tab to see **Reuse** statuses appear on most models. We have new flower orders, so the stg\_flower\_orders and downstream models are rerun (status: success), while the rest of the models are reused, since there is no new data.   
   
   💡 *Fusion automatically skips models without fresh data, saving pipeline execution time and avoiding data platform costs*

9. On the **Prod Job (State Aware Orchestration Enabled)** page, click on **Models** underneath the Overview section. View the **Models Built vs. Models Reused** chart to monitor efficiency gains.  

<Lightbox src="/img/guides/coalesce-fusion-qs/models-reused.png" width="90%" title="💡 State aware orchestration ensures only changed data is processed." />

## Section 4: Learn More

Stop by the **dbt Booth in the Discovery Hall** to learn more about the Fusion-powered features mentioned in the keynote, witness the magic firsthand at any of our demo pods, and dive deeper into use cases, success stories, and migration details through ongoing lightning talks.

Learn more about the dbt Fusion Engine in the docs: [About Fusion](https://docs.getdbt.com/docs/fusion/about-fusion)

Continue learning dbt at [learn.getdbt.com](http://learn.getdbt.com)

