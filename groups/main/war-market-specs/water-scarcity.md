# Market 5: Water Scarcity Infrastructure — Climate Stress Basket

## Overview

Synthetic equity pair basket capturing water scarcity premium through long water infrastructure/treatment vs short water-intensive industries. This basket profits from climate-driven water stress by exploiting the divergence between water infrastructure investment (accelerates during scarcity) and water-intensive industries (contract as costs rise and access degrades).

## Basket Composition

### Long Leg: Water Infrastructure & Treatment
- **AWK** (American Water Works): 40% — Largest U.S. water utility, regulated infrastructure
- **XYL** (Xylem): 35% — Water transport, treatment technology, smart metering
- **ECL** (Ecolab): 25% — Industrial water treatment, efficiency solutions

**Rationale**: Direct beneficiaries of water scarcity. AWK captures infrastructure investment, XYL scales tech deployment, ECL monetizes efficiency demand. All have pricing power during supply stress.

### Short Leg: Water-Intensive Industries
- **MOS** (Mosaic): 35% — Phosphate/potash mining (water-intensive fertilizer production)
- **FCX** (Freeport-McMoRan): 35% — Copper mining (2,000+ liters/kg copper)
- **AWR** (American States Water): 30% — California utility (high drought exposure)

**Rationale**: Operations degrade under water stress. Mining requires massive freshwater input. California utilities face regulatory curtailment. Rising water costs compress margins.

## Entry Criteria

Deploy when **2 of 3** conditions are met:

1. **Climate Stress Index (CSI) > 70**
   - Composite of: U.S. Drought Monitor severity, reservoir levels (Lake Mead, Oroville), groundwater depletion rate, heat wave frequency
   - Source: NOAA, U.S. Bureau of Reclamation, USGS groundwater data

2. **Water Infrastructure Investment Acceleration**
   - Congress passes water infrastructure bill OR
   - EPA announces new PFAS/drinking water standards (forces capex) OR
   - State-level water bonds pass (California, Arizona, Colorado)

3. **Water-Intensive Industry Stress**
   - Mining sector water costs increase >15% YoY (3-month rolling avg) AND
   - California Public Utilities Commission issues curtailment orders OR agricultural water allocations cut >20%

## Leverage Parameters

- **Initial leverage**: 2x on both legs
- **Maximum leverage**: 3.5x (scale up if scarcity premium expands >20%)
- **Minimum leverage**: 1x (de-risk if precipitation normalizes)

**Position sizing**:
- Equal notional on long and short legs (dollar-neutral)
- Adjust quarterly for sector drift
- Use options overlays for tail risk (OTM puts on infrastructure, calls on mining recovery)

## Water Scarcity Premium Metric

**Scarcity Premium = (Infrastructure Basket Return - Water-Intensive Basket Return) × Leverage Multiple**

Target capture: 75%+ of the spread during acute drought/regulatory escalation phases.

**Monitoring frequency**: Weekly rebalancing if individual position drifts >12% from target weight. Daily monitoring of reservoir levels and drought classifications.

## Resolution Conditions

**Exit (full unwind) when ANY of:**

1. **Precipitation Normalization**: U.S. Drought Monitor shows <30% of Western states in severe drought for 60 consecutive days
2. **Correlation Breakdown**: 90-day rolling correlation between infrastructure and water-intensive legs >0.7 (basket thesis invalidated)
3. **Profit Target**: Scarcity premium exceeds +30% cumulative return
4. **Stop Loss**: Scarcity premium falls below -15% (thesis failure)

**Partial de-risk (reduce to 1x leverage) when**:
- Scarcity premium gains >20% but <30% AND volatility spikes (VIX >28)
- Major precipitation events (El Niño forecast, atmospheric rivers restore >15% of reservoir capacity)
- Federal emergency water transfers announced (government intervention dampens pricing power)

## Risk Management

**Hedges**:
- Long agriculture futures (corn/wheat) — inversely correlated with water scarcity severity
- Weather derivatives (precipitation puts) for tail protection
- Sector beta neutrality: Adjust weights if utilities/industrials decouple from broader market

**Max drawdown limit**: -18% from peak equity. If breached, reduce leverage to 0.5x and reassess.

**Liquidity requirements**: All positions must maintain >$50M avg daily volume. Exit any stock if ADV drops below threshold.

## Climate Stress Indicators

**Primary signals** (monitor weekly):
- U.S. Drought Monitor (Palmer Drought Severity Index, surface water supply index)
- Bureau of Reclamation reservoir levels (Lake Mead, Lake Powell, California State Water Project)
- USGS groundwater depletion rates (High Plains Aquifer, Central Valley)
- NOAA heat wave frequency/duration (Western U.S. focus)
- Colorado River compact compliance status (allocation cuts trigger scarcity pricing)

**Secondary signals** (monitor monthly):
- EPA drinking water compliance violations (infrastructure upgrade demand)
- California State Water Resources Control Board curtailment orders
- Mining industry water cost disclosures (quarterly earnings)
- Agricultural water allocation cuts (Bureau of Reclamation announcements)
- Water ETF flows (PHO, CGW) — institutional positioning

**Dashboard refresh**: Weekly scraper for NOAA/USGS data + real-time Bloomberg terminal for equity price action.

## Deployment Checklist

- [ ] Verify all 6 equities have options liquidity (bid-ask <1.5% for ATM contracts)
- [ ] Set up automated CSI composite calculation (weekly refresh)
- [ ] Configure risk alerts (Telegram notifications for stop-loss breaches)
- [ ] Backtest 2011-2024 (California drought, Lake Mead crisis, Southwest megadrought) — validate 65%+ win rate
- [ ] Paper trade 60 days before live deployment (longer cycle than geopolitical baskets)
- [ ] Confirm broker supports pair trading margin (portfolio margining enabled)
- [ ] Establish data feeds: NOAA API, USGS water data, Bureau of Reclamation reports

---

**Document version**: 1.0
**Last updated**: 2026-03-30
**Status**: Specification complete, awaiting backtest validation
