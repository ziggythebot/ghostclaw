# Market 4: Semiconductor Geopolitics — TSMC Invasion Risk Basket

## Overview

Synthetic equity pair basket capturing Taiwan strait invasion risk through long Taiwan-dependent semiconductor companies vs short domestic semiconductor production. This basket profits from geopolitical de-risking by exploiting the divergence between Taiwan-concentrated supply chains (high geopolitical risk) and Western/US domestic semiconductor manufacturing (risk premium during tension).

## Basket Composition

### Short Leg: Taiwan Exposure (High Invasion Risk)
- **TSM** (Taiwan Semiconductor Manufacturing): 60% — 90% of advanced logic chips, Apple/NVIDIA dependency
- **ASML** (ASML Holding): 40% — EUV lithography monopoly, 100% Taiwan fab reliance

**Rationale**: TSMC is the single point of failure for global semiconductor supply. ASML's EUV machines are critical for TSMC's leading-edge production. Both catastrophically exposed to Taiwan strait conflict.

### Long Leg: Domestic Production (Geopolitical Hedge)
- **INTC** (Intel): 60% — US domestic fabs (Arizona, Ohio), government subsidies via CHIPS Act
- **SSNLF** (Samsung Electronics): 40% — South Korea fabs, US expansion (Texas), geographically diversified

**Rationale**: Intel and Samsung are the only viable alternatives to TSMC for leading-edge production. Both benefit from onshoring subsidies and strategic importance during Taiwan crisis.

## Entry Criteria

Deploy when **2 of 3** conditions are met:

1. **Taiwan Strait Tension Index (TSTI) > 70**
   - Composite of: PLA military exercises near Taiwan, US arms sales to Taiwan, diplomatic incidents (embassy closures, expulsions), Chinese fighter jet incursions into ADIZ
   - Source: CSIS ChinaPower project, Taiwan MoD daily reports, GDELT tone analysis

2. **Semiconductor Supply Chain Alarm**
   - US Commerce Department export controls tighten (e.g., chip equipment bans) OR
   - TSMC stock volatility (30-day realized vol) exceeds 45% OR
   - Major tech customers (AAPL, NVDA, AMD) announce supply chain diversification

3. **Onshoring Momentum**
   - CHIPS Act funding announcements >$10B in trailing quarter OR
   - Intel/Samsung fab construction milestones hit (first wafer out, volume production) OR
   - US semiconductor production capacity share increases >0.5% YoY (currently ~12%)

## Leverage Parameters

- **Initial leverage**: 1.5x on both legs (geopolitical tail risk requires caution)
- **Maximum leverage**: 2.5x (scale up if invasion probability spikes >30%)
- **Minimum leverage**: 0.5x (de-risk if tensions de-escalate rapidly)

**Position sizing**:
- Equal notional on long and short legs (dollar-neutral)
- Hedge with OTM calls on Taiwan strait conflict prediction markets (Polymarket, Kalshi)
- Use SOXX ETF (semiconductor sector) as beta hedge to isolate geopolitical alpha

## Taiwan Strait Tension Metrics

**Taiwan Strait Tension Index (TSTI) = Weighted Average of:**

1. **Military Activity (40%)**
   - PLA fighter jet incursions into Taiwan ADIZ (daily count)
   - Naval exercises within 100nm of Taiwan (frequency)
   - US carrier strike group transits through Taiwan Strait (monthly count)
   - Source: Taiwan MoD daily press releases, USNI News

2. **Diplomatic Incidents (30%)**
   - US-China high-level meeting cancellations
   - Taiwan diplomatic recognition changes (countries switching to/from PRC)
   - UN/WHO Taiwan exclusion escalations
   - Source: Reuters, Bloomberg, GDELT event database

3. **Economic Warfare (20%)**
   - US chip export controls (entity list additions, technology node restrictions)
   - TSMC revenue from Chinese customers (declining = sanctions, rising = dependency)
   - Rare earth export restrictions (China controls 70% of supply)
   - Source: US Commerce Dept, TSMC earnings calls, USGS

4. **Market Implied Probability (10%)**
   - Polymarket "Will China invade Taiwan by [date]" odds
   - Taiwan sovereign CDS spreads (widening = risk premium)
   - TWSE (Taiwan Stock Exchange) index volatility
   - Source: Polymarket API, Bloomberg

**Scoring**: Each component normalized 0-100. TSTI >70 = high invasion risk. TSTI <40 = stable.

## Resolution Conditions

**Exit (full unwind) when ANY of:**

1. **De-escalation Signal**: US-China summit with explicit Taiwan status quo commitment, TSTI falls below 40 for 60 consecutive days, or peaceful reunification referendum
2. **Invasion Event**: PLA initiates military action (naval blockade, amphibious assault, or cyber/missile attack on Taiwan infrastructure) — immediate liquidation, thesis realized
3. **Onshoring Completion**: Intel/Samsung achieve parity with TSMC at 3nm node AND US domestic production >20% global share (thesis obsolete)
4. **Profit Target**: Basket spread exceeds +30% cumulative return
5. **Stop Loss**: Basket spread falls below -15% (thesis failure, wrong directional bet)

**Partial de-risk (reduce to 0.5x leverage) when**:
- TSTI >85 (imminent conflict risk, liquidate before trading halts)
- TSMC announces Arizona fab fully operational (reduces Taiwan dependency)
- Basket spread gains >20% but <30% AND semiconductor sector enters bear market (SOX index -20% from peak)

## Risk Management

**Hedges**:
- Long OTM puts on TSM (direct invasion insurance, strikes at -30% from current)
- Long calls on defense ETFs (XAR, ITA) — war proxy hedge
- Gold allocation (5% of basket notional) — safe haven if invasion triggers global risk-off

**Max drawdown limit**: -20% from peak equity. If breached, reduce leverage to 0.25x and shift to pure options strategies (selling downside puts on domestic semis).

**Liquidity requirements**:
- TSM, INTC: >$1B avg daily volume (highly liquid)
- ASML, SSNLF: >$200M avg daily volume (acceptable)
- Exit immediately if ADV drops >50% (liquidity crisis signal)

**Correlation monitoring**:
- Target correlation between short leg (TSM/ASML) and long leg (INTC/SSNLF): <0.3
- If correlation >0.6 for 30 days, thesis broken (sector moves dominating geopolitical alpha) — exit

## Geopolitical Intelligence Sources

**Primary signals** (monitor daily):
- Taiwan Ministry of Defense daily ADIZ incursion reports
- CSIS ChinaPower Taiwan tracker (military balance updates)
- GDELT tone analysis (China-Taiwan news sentiment)
- Polymarket invasion probabilities (crowd wisdom)
- TSMC/Intel/Samsung earnings calls (management commentary on geopolitical risk)

**Secondary signals** (monitor weekly):
- US CHIPS Act funding announcements (commerce.gov)
- Semiconductor fab construction progress (Intel Arizona, Samsung Texas)
- Export control rule changes (Federal Register, BIS entity list updates)
- Academic papers on Taiwan strait military scenarios (RAND, CNAS, CSIS)

**Dashboard refresh**: Python scraper for Taiwan MoD + Polymarket API + Bloomberg terminal for CDS/equity data. Aggregate into daily TSTI score.

## Deployment Checklist

- [ ] Verify ASML and SSNLF have sufficient options liquidity (ADV >10,000 contracts for ATM options)
- [ ] Set up automated TSTI calculation (scrape Taiwan MoD, Polymarket, Bloomberg)
- [ ] Configure risk alerts (Telegram notifications for TSTI >85 or stop-loss breaches)
- [ ] Backtest 2018-2024 (Trump-Xi tariffs, Pelosi Taiwan visit, 2022 PLA exercises) — validate 65%+ win rate
- [ ] Paper trade 60 days before live deployment (geopolitical timing requires calibration)
- [ ] Confirm broker supports international equities (TSM ADR, ASML, SSNLF OTC)
- [ ] Set up redundant data feeds (Taiwan MoD site may go offline during conflict)

## Trade Example

**Scenario**: March 2027 — PLA announces 30-day "joint sword" military exercises encircling Taiwan. TSTI spikes from 55 to 78.

**Entry**:
- Short $100k TSM at $145 (60% weight)
- Short $67k ASML at $950 (40% weight)
- Long $100k INTC at $48 (60% weight)
- Long $67k SSNLF at $52 (40% weight)
- Total notional: $334k (1.67x leverage on $200k capital)

**Outcome (3 months)**:
- TSM drops to $115 (-21%) — Taiwan risk premium
- ASML drops to $850 (-11%) — TSMC dependency
- INTC rises to $56 (+17%) — onshoring narrative
- SSNLF rises to $60 (+15%) — safe alternative

**P&L**:
- Short leg gain: ($100k × 21%) + ($67k × 11%) = $28,370
- Long leg gain: ($100k × 17%) + ($67k × 15%) = $27,050
- **Total return**: +$55,420 on $200k capital = +27.7%

**Exit**: TSTI falls to 62 after US-China defense ministers meeting. Take profit.

---

**Document version**: 1.0
**Last updated**: 2026-03-30
**Status**: Specification complete, awaiting backtest validation
