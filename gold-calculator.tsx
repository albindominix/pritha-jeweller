"use client"

import { useState, useEffect } from "react"
import { Calculator, Percent, Scale, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function GoldCalculator() {
  // Default gold rate in INR per troy ounce (31.1035 grams)
  const defaultGoldRate = 285179.9

  // State variables
  const [goldWeight, setGoldWeight] = useState<number | "">("")
  const [goldPurity, setGoldPurity] = useState("24")
  const [goldRate, setGoldRate] = useState<number>(defaultGoldRate)
  const [goldRatePerGram, setGoldRatePerGram] = useState<number>(defaultGoldRate / 31.1035)
  const [makingCharge, setMakingCharge] = useState<number | "">("")
  const [makingChargeType, setMakingChargeType] = useState<"percentage" | "fixed">("percentage")
  const [totalCost, setTotalCost] = useState<number | "">("")
  const [calculationMode, setCalculationMode] = useState<"totalCost" | "makingCharge">("totalCost")

  // Calculate gold rate per gram based on purity
  useEffect(() => {
    const purityFactor = Number(goldPurity) / 24
    const ratePerGram = (goldRate / 31.1035) * purityFactor
    setGoldRatePerGram(ratePerGram)
  }, [goldPurity, goldRate])

  // Calculate total cost
  const calculateTotalCost = () => {
    if (goldWeight === "" || goldWeight <= 0) return

    const baseGoldCost = Number(goldWeight) * goldRatePerGram
    let makingChargeAmount = 0

    if (makingCharge !== "") {
      if (makingChargeType === "percentage") {
        makingChargeAmount = baseGoldCost * (Number(makingCharge) / 100)
      } else {
        makingChargeAmount = Number(makingCharge)
      }
    }

    setTotalCost(baseGoldCost + makingChargeAmount)
  }

  // Calculate making charge
  const calculateMakingCharge = () => {
    if (goldWeight === "" || goldWeight <= 0 || totalCost === "" || totalCost <= 0) return

    const baseGoldCost = Number(goldWeight) * goldRatePerGram
    const makingChargeAmount = Number(totalCost) - baseGoldCost

    if (makingChargeType === "percentage") {
      setMakingCharge(makingChargeAmount > 0 ? (makingChargeAmount / baseGoldCost) * 100 : 0)
    } else {
      setMakingCharge(makingChargeAmount > 0 ? makingChargeAmount : 0)
    }
  }

  // Handle calculation
  const handleCalculate = () => {
    if (calculationMode === "totalCost") {
      calculateTotalCost()
    } else {
      calculateMakingCharge()
    }
  }

  // Generate calculation steps for the modal
  const getCalculationSteps = () => {
    if (calculationMode === "totalCost" && totalCost !== "") {
      const baseGoldCost = Number(goldWeight) * goldRatePerGram
      let makingChargeAmount = 0

      if (makingCharge !== "") {
        if (makingChargeType === "percentage") {
          makingChargeAmount = baseGoldCost * (Number(makingCharge) / 100)
        } else {
          makingChargeAmount = Number(makingCharge)
        }
      }

      return (
        <div className="font-handwritten text-lg leading-relaxed space-y-4">
          <div className="border-b pb-2">
            <div className="text-xl font-bold mb-2">Step 1: Calculate Gold Value</div>
            <div>Gold Weight = {Number(goldWeight).toFixed(2)} grams</div>
            <div>
              Gold Rate ({goldPurity}K) = ₹{goldRatePerGram.toFixed(2)}/gram
            </div>
            <div className="flex items-center mt-1">
              <div className="mr-2">Gold Value = Weight × Rate</div>
              <div className="ml-auto">
                = {Number(goldWeight).toFixed(2)} × ₹{goldRatePerGram.toFixed(2)}
              </div>
            </div>
            <div className="text-right font-bold">= ₹{baseGoldCost.toFixed(2)}</div>
          </div>

          <div className="border-b pb-2">
            <div className="text-xl font-bold mb-2">Step 2: Calculate Making Charge</div>
            {makingChargeType === "percentage" ? (
              <>
                <div>Making Charge = {Number(makingCharge).toFixed(2)}% of Gold Value</div>
                <div className="flex items-center mt-1">
                  <div className="mr-2">Making Charge Amount = Gold Value × (Making Charge % ÷ 100)</div>
                </div>
                <div className="flex items-center">
                  <div className="mr-2"></div>
                  <div className="ml-auto">
                    = ₹{baseGoldCost.toFixed(2)} × ({Number(makingCharge).toFixed(2)} ÷ 100)
                  </div>
                </div>
                <div className="text-right font-bold">= ₹{makingChargeAmount.toFixed(2)}</div>
              </>
            ) : (
              <>
                <div>Making Charge (Fixed) = ₹{Number(makingCharge).toFixed(2)}</div>
              </>
            )}
          </div>

          <div>
            <div className="text-xl font-bold mb-2">Step 3: Calculate Total Cost</div>
            <div className="flex items-center">
              <div className="mr-2">Total Cost = Gold Value + Making Charge</div>
            </div>
            <div className="flex items-center">
              <div className="mr-2"></div>
              <div className="ml-auto">
                = ₹{baseGoldCost.toFixed(2)} + ₹{makingChargeAmount.toFixed(2)}
              </div>
            </div>
            <div className="text-right font-bold text-xl">= ₹{Number(totalCost).toFixed(2)}</div>
          </div>
        </div>
      )
    } else if (calculationMode === "makingCharge" && makingCharge !== "") {
      const baseGoldCost = Number(goldWeight) * goldRatePerGram
      const makingChargeAmount =
        makingChargeType === "percentage" ? baseGoldCost * (Number(makingCharge) / 100) : Number(makingCharge)

      return (
        <div className="font-handwritten text-lg leading-relaxed space-y-4">
          <div className="border-b pb-2">
            <div className="text-xl font-bold mb-2">Step 1: Calculate Gold Value</div>
            <div>Gold Weight = {Number(goldWeight).toFixed(2)} grams</div>
            <div>
              Gold Rate ({goldPurity}K) = ₹{goldRatePerGram.toFixed(2)}/gram
            </div>
            <div className="flex items-center mt-1">
              <div className="mr-2">Gold Value = Weight × Rate</div>
              <div className="ml-auto">
                = {Number(goldWeight).toFixed(2)} × ₹{goldRatePerGram.toFixed(2)}
              </div>
            </div>
            <div className="text-right font-bold">= ₹{baseGoldCost.toFixed(2)}</div>
          </div>

          <div className="border-b pb-2">
            <div className="text-xl font-bold mb-2">Step 2: Calculate Making Charge</div>
            <div>Total Cost = ₹{Number(totalCost).toFixed(2)}</div>
            <div className="flex items-center mt-1">
              <div className="mr-2">Making Charge Amount = Total Cost - Gold Value</div>
            </div>
            <div className="flex items-center">
              <div className="mr-2"></div>
              <div className="ml-auto">
                = ₹{Number(totalCost).toFixed(2)} - ₹{baseGoldCost.toFixed(2)}
              </div>
            </div>
            <div className="text-right font-bold">= ₹{(Number(totalCost) - baseGoldCost).toFixed(2)}</div>
          </div>

          {makingChargeType === "percentage" && (
            <div>
              <div className="text-xl font-bold mb-2">Step 3: Convert to Percentage</div>
              <div className="flex items-center">
                <div className="mr-2">Making Charge % = (Making Charge Amount ÷ Gold Value) × 100</div>
              </div>
              <div className="flex items-center">
                <div className="mr-2"></div>
                <div className="ml-auto">
                  = (₹{(Number(totalCost) - baseGoldCost).toFixed(2)} ÷ ₹{baseGoldCost.toFixed(2)}) × 100
                </div>
              </div>
              <div className="text-right font-bold text-xl">= {Number(makingCharge).toFixed(2)}%</div>
            </div>
          )}
        </div>
      )
    }

    return <div className="text-center text-gray-500">No calculation performed yet</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 md:p-8">
      <Card className="mx-auto max-w-2xl p-6 shadow-lg bg-white">
        <div className="flex items-center justify-center mb-6">
          <Scale className="h-8 w-8 text-amber-600 mr-2" />
          <h1 className="text-2xl font-bold text-amber-800">Gold Jewelry Price Calculator</h1>
        </div>

        <Tabs defaultValue="totalCost" className="mb-6" onValueChange={(value) => setCalculationMode(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="totalCost">Calculate Total Cost</TabsTrigger>
            <TabsTrigger value="makingCharge">Calculate Making Charge</TabsTrigger>
          </TabsList>

          <TabsContent value="totalCost" className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Enter gold weight and making charge to calculate the total jewelry cost
            </p>
          </TabsContent>

          <TabsContent value="makingCharge" className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Enter gold weight and total cost to calculate the making charge
            </p>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="goldPurity">Gold Purity</Label>
            <Select value={goldPurity} onValueChange={setGoldPurity}>
              <SelectTrigger id="goldPurity">
                <SelectValue placeholder="Select purity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 Karat (99.9% pure)</SelectItem>
                <SelectItem value="22">22 Karat (91.6% pure)</SelectItem>
                <SelectItem value="18">18 Karat (75% pure)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="goldRate">Gold Rate (₹ per troy ounce)</Label>
            <Input
              id="goldRate"
              type="number"
              value={goldRate}
              onChange={(e) => setGoldRate(Number(e.target.value))}
              placeholder="Enter current gold rate"
            />
            <p className="text-xs text-muted-foreground">
              Current rate: ₹{goldRatePerGram.toFixed(2)} per gram for {goldPurity}K gold
            </p>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="goldWeight">Gold Weight (grams)</Label>
            <Input
              id="goldWeight"
              type="number"
              value={goldWeight}
              onChange={(e) => setGoldWeight(e.target.value ? Number(e.target.value) : "")}
              placeholder="Enter gold weight in grams"
            />
          </div>

          {calculationMode === "totalCost" ? (
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="makingCharge">Making Charge</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={makingChargeType === "percentage" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMakingChargeType("percentage")}
                  >
                    <Percent className="h-4 w-4 mr-1" />
                    Percentage
                  </Button>
                  <Button
                    variant={makingChargeType === "fixed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMakingChargeType("fixed")}
                  >
                    ₹ Fixed
                  </Button>
                </div>
              </div>
              <Input
                id="makingCharge"
                type="number"
                value={makingCharge}
                onChange={(e) => setMakingCharge(e.target.value ? Number(e.target.value) : "")}
                placeholder={`Enter making charge ${makingChargeType === "percentage" ? "%" : "₹"}`}
              />
            </div>
          ) : (
            <div className="grid gap-3">
              <Label htmlFor="totalCost">Total Jewelry Cost (₹)</Label>
              <Input
                id="totalCost"
                type="number"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value ? Number(e.target.value) : "")}
                placeholder="Enter total jewelry cost"
              />
            </div>
          )}

          <Button onClick={handleCalculate} className="w-full bg-amber-600 hover:bg-amber-700">
            <Calculator className="h-5 w-5 mr-2" />
            Calculate
          </Button>

          {calculationMode === "totalCost" && totalCost !== "" && (
            <div className="mt-4 p-4 bg-amber-50 rounded-md border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-amber-800">Results:</h3>
                <Dialog >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      Show Calculation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-screen overflow-auto">
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl">Detailed Calculation</DialogTitle>
                    </DialogHeader>
                    <div className="bg-amber-50 p-6 rounded-md border border-amber-200 mt-2">
                      <div
                        className="bg-white p-6 rounded shadow-inner"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(transparent, transparent 31px, #ccc 31px, #ccc 32px)",
                        }}
                      >
                        {getCalculationSteps()}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Gold Value:</div>
                <div className="text-right">₹{(Number(goldWeight) * goldRatePerGram).toFixed(2)}</div>

                <div>Making Charge:</div>
                <div className="text-right">
                  {makingChargeType === "percentage"
                    ? `${makingCharge}% (₹${((Number(makingCharge) / 100) * Number(goldWeight) * goldRatePerGram).toFixed(2)})`
                    : `₹${Number(makingCharge).toFixed(2)}`}
                </div>

                <div className="font-semibold">Total Cost:</div>
                <div className="text-right font-semibold">₹{Number(totalCost).toFixed(2)}</div>
              </div>
            </div>
          )}

          {calculationMode === "makingCharge" && makingCharge !== "" && (
            <div className="mt-4 p-4 bg-amber-50 rounded-md border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-amber-800">Results:</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      Show Calculation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-screen overflow-auto">
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl">Detailed Calculation</DialogTitle>
                    </DialogHeader>
                    <div className="bg-amber-50 p-6 rounded-md border border-amber-200 mt-2">
                      <div
                        className="bg-white p-6 rounded shadow-inner"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(transparent, transparent 31px, #ccc 31px, #ccc 32px)",
                        }}
                      >
                        {getCalculationSteps()}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Gold Value:</div>
                <div className="text-right">₹{(Number(goldWeight) * goldRatePerGram).toFixed(2)}</div>

                <div className="font-semibold">Making Charge:</div>
                <div className="text-right font-semibold">
                  {makingChargeType === "percentage"
                    ? `${Number(makingCharge).toFixed(2)}% (₹${((Number(makingCharge) / 100) * Number(goldWeight) * goldRatePerGram).toFixed(2)})`
                    : `₹${Number(makingCharge).toFixed(2)}`}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
