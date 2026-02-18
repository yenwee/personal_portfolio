## Millions of credit records, zero declared incomes

Half the borrowers in the national credit database had no declared income. The bureau still needed to estimate it -- lenders cannot price risk against a blank field. I owned this problem end-to-end: **from a 6TB warehouse of raw credit records to production endpoints returning predictions in milliseconds**.

The income estimation model used XGBoost trained on credit bureau signals -- repayment patterns, facility utilization, account tenure -- to infer income where declarations were missing or unverifiable. Every prediction shipped with SHAP values because explainability was non-negotiable; a score that feeds lending decisions must justify itself to compliance.

## From 6TB warehouse to production endpoint

I built the data layer first. A PostgreSQL warehouse consolidated credit records from the central bureau alongside data from automated web scraping jobs. **Apache Airflow orchestrated daily ETL replication**, keeping the warehouse current as millions of new records flowed in.

> [!insight] Unified Data Layer
> Centralizing ingestion into a single warehouse eliminated fragmented data access patterns that had slowed feature development.

Feast served as the feature store, decoupling feature computation from model training and guaranteeing consistency between offline experimentation and online inference. MLflow tracked every experiment -- hyperparameters, metrics, artifacts -- so any result could be reproduced months later. When a model was promoted, it was served through **FastAPI endpoints containerized with Docker**, exposing REST interfaces that bureau members could integrate directly.

## When a well-ranked model still breaks downstream

The loan screening model predicted default probability at application time. I hit 0.75 AUC early, but the real work started after that. **Class imbalance in credit default data means a well-ranked model can still produce badly behaved score distributions** -- lenders consuming the scores need calibrated probabilities, not just correct orderings.

I spent weeks on calibration curves and threshold selection, iterating until the score distributions behaved predictably across risk tiers. A model that ranks borrowers correctly but assigns 90% of them to the same probability bucket is useless to a lender setting cutoffs.

> [!decision] Early Investment in Retraining
> The warehouse grew daily; models that couldn't keep pace with distributional shift would degrade within weeks.

Building automated retraining early meant the pipeline could detect drift and refresh models before downstream consumers noticed degradation.

## What I Learned

The hardest part was not modeling -- it was **building the infrastructure that made modeling sustainable**. A feature store, experiment tracking, and automated retraining sound like overhead until the warehouse doubles in size and your first-generation model silently drifts. I learned that in production ML, the pipeline around the model matters more than the model itself.
