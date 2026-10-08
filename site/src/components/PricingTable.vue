<script setup lang="ts">
import { computed, ref } from 'vue'
import Badge from './ui/Badge.vue'
import Button from './ui/Button.vue'

type BillingPeriod = 'monthly' | 'yearly'

interface PricingTier {
  name: string
  monthlyPrice: number
  yearlyPricePerMonth: number
  features: string[]
  isHighlighted: boolean
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Hobby',
    monthlyPrice: 0,
    yearlyPricePerMonth: 0,
    features: ['Unlimited slots', 'Vite plugin', 'Community support'],
    isHighlighted: false,
  },
  {
    name: 'Team',
    monthlyPrice: 12,
    yearlyPricePerMonth: 10,
    features: ['Everything in Hobby', 'Volar typing for classes', 'Shared presets', 'Email support'],
    isHighlighted: true,
  },
  {
    name: 'Business',
    monthlyPrice: 39,
    yearlyPricePerMonth: 32,
    features: ['Everything in Team', 'Design token audit', 'Priority support'],
    isHighlighted: false,
  },
]

const billingPeriod = ref<BillingPeriod>('monthly')

const isMonthlyBilling = computed(() => billingPeriod.value === 'monthly')
const isYearlyBilling = computed(() => billingPeriod.value === 'yearly')
const billingNote = computed(() => (isYearlyBilling.value ? '/ month, billed yearly' : '/ month'))

function selectBillingPeriod(period: BillingPeriod) {
  billingPeriod.value = period
}

function getDisplayedPrice(tier: PricingTier) {
  return isYearlyBilling.value ? tier.yearlyPricePerMonth : tier.monthlyPrice
}

function getCallToActionVariant(tier: PricingTier) {
  return tier.isHighlighted ? 'default' : 'outline'
}
</script>

<template>
  <div :class="[classes.base.root]">
    <div :class="[classes.base.toggleGroup]" role="group" aria-label="Billing period">
      <Button
        variant="ghost"
        size="sm"
        :class="[classes.base.toggleButton]"
        :aria-pressed="isMonthlyBilling"
        @click="selectBillingPeriod('monthly')"
      >
        Monthly
      </Button>
      <Button
        variant="ghost"
        size="sm"
        :class="[classes.base.toggleButton]"
        :aria-pressed="isYearlyBilling"
        @click="selectBillingPeriod('yearly')"
      >
        Yearly
      </Button>
    </div>

    <ul :class="[classes.base.grid]">
      <li
        v-for="tier in pricingTiers"
        :key="tier.name"
        :class="[classes.base.card]"
        :data-highlighted="tier.isHighlighted"
      >
        <div :class="[classes.base.cardHeader]">
          <h3 :class="[classes.base.tierName]">{{ tier.name }}</h3>
          <Badge v-if="tier.isHighlighted" variant="secondary">Most popular</Badge>
        </div>

        <p :class="[classes.base.priceRow]">
          <span :class="[classes.base.price]">${{ getDisplayedPrice(tier) }}</span>
          <span :class="[classes.base.period]">{{ billingNote }}</span>
        </p>

        <ul :class="[classes.base.featureList]">
          <li v-for="feature in tier.features" :key="feature" :class="[classes.base.featureItem]">
            {{ feature }}
          </li>
        </ul>

        <Button :variant="getCallToActionVariant(tier)">Choose {{ tier.name }}</Button>
      </li>
    </ul>
  </div>
</template>

<tailwind lang="yaml">
base:
  root:
    - flex flex-col gap-6
  toggleGroup:
    - inline-flex w-fit gap-1 rounded-lg bg-muted p-1
  toggleButton:
    - aria-pressed:bg-background aria-pressed:shadow-sm
  grid:
    - grid gap-4 md:grid-cols-3
  card:
    - flex flex-col gap-6 rounded-xl border bg-card p-6 text-card-foreground shadow-sm
    - data-[highlighted=true]:border-primary data-[highlighted=true]:shadow-md
  cardHeader:
    - flex items-center justify-between gap-2
  tierName:
    - leading-none font-semibold
  priceRow:
    - flex items-baseline gap-1.5
  price:
    - text-4xl font-bold tracking-tight
  period:
    - text-sm text-muted-foreground
  featureList:
    - flex flex-1 flex-col gap-2 text-sm text-muted-foreground
  featureItem:
    - before:mr-2 before:text-foreground before:content-['✓']
</tailwind>
