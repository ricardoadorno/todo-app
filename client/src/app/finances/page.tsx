
"use client";

import AppLayout from "@/components/layout/app-layout";
import { useState, useEffect } from "react";
import type { Transaction, TransactionType, Recurrence, Investment, InvestmentType } from "@/types";
import { useGetTransactions, useAddTransaction, useUpdateTransaction, useDeleteTransaction } from "@/services/finance-service";
import { useGetInvestments, useAddInvestment, useUpdateInvestment, useDeleteInvestment } from "@/services/finance-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DollarSign, PlusCircle, Edit, Trash2, TrendingUp, TrendingDown, Repeat2, Briefcase, Banknote, Package, Building, Bitcoin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";


const transactionTypeOptions: { value: TransactionType; label: string }[] = [
  { value: 'INCOME', label: 'Receita' },
  { value: 'EXPENSE', label: 'Despesa' },
];

const transactionCategoryOptions: string[] = [
  "Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Educação", "Salário", "Investimentos", "Utilidades", "Freelance", "Vendas", "Social", "Outros"
];

const recurrenceOptions: { value: Recurrence; label: string }[] = [
  { value: 'NONE', label: 'Nenhuma' },
  { value: 'DAILY', label: 'Diariamente' },
  { value: 'WEEKLY', label: 'Semanalmente' },
  { value: 'MONTHLY', label: 'Mensalmente' },
  { value: 'YEARLY', label: 'Anualmente' },
];

const investmentTypeOptions: { value: InvestmentType; label: string; icon: React.ElementType }[] = [
  { value: 'STOCK', label: 'Ações', icon: Banknote },
  { value: 'CRYPTO', label: 'Criptomoedas', icon: Bitcoin },
  { value: 'FUND', label: 'Fundos de Investimento', icon: Package },
  { value: 'REAL_ESTATE', label: 'Imóveis', icon: Building },
  { value: 'OTHER', label: 'Outro', icon: Briefcase },
];

const TransactionForm = ({ transaction, onSubmit, onCancel }: { transaction?: Transaction | null, onSubmit: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void, onCancel: () => void }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [category, setCategory] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState<Recurrence>('NONE');
  const { toast } = useToast();

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description || "");
      setAmount(transaction.amount.toString() || "");
      setType(transaction.type || 'EXPENSE');
      setDate(transaction.date ? format(parseISO(transaction.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
      setCategory(transaction.category || "");
      setIsRecurring(transaction.isRecurring || false);
      setRecurrenceInterval(transaction.recurrenceInterval || 'NONE');
    } else {
      setDescription("");
      setAmount("");
      setType('EXPENSE');
      setDate(format(new Date(), "yyyy-MM-dd"));
      setCategory("");
      setIsRecurring(false);
      setRecurrenceInterval('NONE');
    }
  }, [transaction]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({ title: "Valor Inválido", description: "Por favor, insira um valor numérico positivo para a transação.", variant: "destructive" });
      return;
    }
    if (!description.trim()) {
      toast({ title: "Descrição Obrigatória", description: "Por favor, forneça uma descrição para a transação.", variant: "destructive" });
      return;
    }
    if (!date) {
      toast({ title: "Data Inválida", description: "Por favor, selecione uma data válida.", variant: "destructive" });
      return;
    }

    onSubmit({
      description: description.trim(),
      amount: parsedAmount,
      type,
      date: new Date(date).toISOString(),
      category: category.trim() || "Outros",
      isRecurring,
      recurrenceInterval: isRecurring ? (recurrenceInterval === 'NONE' ? 'MONTHLY' : recurrenceInterval) : 'NONE',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="transaction-description">Descrição</Label>
        <Input id="transaction-description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="transaction-amount">Valor (R$)</Label>
          <Input id="transaction-amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="transaction-type">Tipo</Label>
          <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
            <SelectTrigger id="transaction-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              {transactionTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="transaction-date">Data</Label>
          <Input id="transaction-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="transaction-category">Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="transaction-category">
              <SelectValue placeholder="Selecione ou digite" />
            </SelectTrigger>
            <SelectContent>
              {transactionCategoryOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="transaction-recurring"
            checked={isRecurring}
            onCheckedChange={(checked) => {
              const newIsRecurring = !!checked;
              setIsRecurring(newIsRecurring);
              if (!newIsRecurring) {
                setRecurrenceInterval('NONE');
              } else if (recurrenceInterval === 'NONE') {
                setRecurrenceInterval('MONTHLY');
              }
            }}
          />
          <Label htmlFor="transaction-recurring" className="font-normal text-sm">
            Esta é uma transação recorrente?
          </Label>
        </div>

        {isRecurring && (
          <div>
            <Label htmlFor="transaction-recurrence-interval">Frequência da Recorrência</Label>
            <Select
              value={recurrenceInterval === 'NONE' ? 'MONTHLY' : recurrenceInterval}
              onValueChange={(v) => setRecurrenceInterval(v as Recurrence)}
            >
              <SelectTrigger id="transaction-recurrence-interval"><SelectValue /></SelectTrigger>
              <SelectContent>
                {recurrenceOptions.filter(opt => opt.value !== 'NONE').map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{transaction ? 'Salvar Alterações' : 'Adicionar Transação'}</Button>
      </DialogFooter>
    </form>
  );
};

const InvestmentForm = ({ investment, onSubmit, onCancel }: { investment?: Investment | null, onSubmit: (data: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => void, onCancel: () => void }) => {
  const [name, setName] = useState(investment?.name || "");
  const [type, setType] = useState<InvestmentType>(investment?.type || 'STOCK');
  const [quantity, setQuantity] = useState<string>(investment?.quantity?.toString() || "");
  const [purchasePrice, setPurchasePrice] = useState<string>(investment?.purchasePrice?.toString() || "");
  const [currentValue, setCurrentValue] = useState<string>(investment?.currentValue.toString() || "");
  const [purchaseDate, setPurchaseDate] = useState(investment?.purchaseDate ? format(parseISO(investment.purchaseDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState(investment?.notes || "");
  const { toast } = useToast();

  useEffect(() => {
    if (investment) {
      setName(investment.name);
      setType(investment.type);
      setQuantity(investment.quantity?.toString() || "");
      setPurchasePrice(investment.purchasePrice?.toString() || "");
      setCurrentValue(investment.currentValue.toString());
      setPurchaseDate(format(parseISO(investment.purchaseDate), "yyyy-MM-dd"));
      setNotes(investment.notes || "");
    } else {
      setName("");
      setType('STOCK');
      setQuantity("");
      setPurchasePrice("");
      setCurrentValue("");
      setPurchaseDate(format(new Date(), "yyyy-MM-dd"));
      setNotes("");
    }
  }, [investment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCurrentValue = parseFloat(currentValue);
    const parsedQuantity = quantity ? parseFloat(quantity) : undefined;
    const parsedPurchasePrice = purchasePrice ? parseFloat(purchasePrice) : undefined;

    if (!name.trim()) {
      toast({ title: "Nome Obrigatório", description: "Por favor, forneça um nome para o investimento.", variant: "destructive" });
      return;
    }
    if (isNaN(parsedCurrentValue) || parsedCurrentValue < 0) {
      toast({ title: "Valor Atual Inválido", description: "Por favor, insira um valor numérico não negativo.", variant: "destructive" });
      return;
    }
    if (quantity && (isNaN(parsedQuantity!) || parsedQuantity! <= 0)) {
      toast({ title: "Quantidade Inválida", description: "Por favor, insira uma quantidade positiva ou deixe em branco.", variant: "destructive" });
      return;
    }
    if (purchasePrice && (isNaN(parsedPurchasePrice!) || parsedPurchasePrice! < 0)) {
      toast({ title: "Preço de Compra Inválido", description: "Por favor, insira um preço de compra não negativo ou deixe em branco.", variant: "destructive" });
      return;
    }
    if (!purchaseDate) {
      toast({ title: "Data Inválida", description: "Por favor, selecione uma data de compra válida.", variant: "destructive" });
      return;
    }

    onSubmit({
      name: name.trim(),
      type,
      quantity: parsedQuantity,
      purchasePrice: parsedPurchasePrice,
      currentValue: parsedCurrentValue,
      purchaseDate: new Date(purchaseDate).toISOString(),
      notes,
    });
  };

  const selectedTypeOption = investmentTypeOptions.find(opt => opt.value === type);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="investment-name">Nome do Ativo</Label>
        <Input id="investment-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="investment-type">Tipo de Investimento</Label>
          <Select value={type} onValueChange={(v) => setType(v as InvestmentType)}>
            <SelectTrigger id="investment-type">
              <div className="flex items-center gap-2">
                {selectedTypeOption && <selectedTypeOption.icon className="h-4 w-4 text-muted-foreground" />}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {investmentTypeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-2">
                    <opt.icon className="h-4 w-4 text-muted-foreground" />
                    {opt.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="investment-current-value">Valor Atual Total (R$)</Label>
          <Input id="investment-current-value" type="number" step="0.01" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="investment-quantity">Quantidade (Opcional)</Label>
          <Input id="investment-quantity" type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="investment-purchase-price">Preço de Compra Unit. (R$, Opcional)</Label>
          <Input id="investment-purchase-price" type="number" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="investment-purchase-date">Data da Compra/Aporte</Label>
        <Input id="investment-purchase-date" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="investment-notes">Notas (Opcional)</Label>
        <Textarea id="investment-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex: Corretora XP, Objetivo de longo prazo..." />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{investment ? 'Salvar Alterações' : 'Adicionar Investimento'}</Button>
      </DialogFooter>
    </form>
  );
};


export default function FinancesPage() {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [isInvestmentFormOpen, setIsInvestmentFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const { toast } = useToast();

  // Usando os hooks de serviço para buscar dados
  const { data: transactions = [], isLoading: isLoadingTransactions } = useGetTransactions();
  const { data: investments = [], isLoading: isLoadingInvestments } = useGetInvestments();

  // Hooks para mutações
  const addTransactionMutation = useAddTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  const addInvestmentMutation = useAddInvestment();
  const updateInvestmentMutation = useUpdateInvestment();
  const deleteInvestmentMutation = useDeleteInvestment(); const totalIncome = transactions
    .filter(t => t.type === 'INCOME' && typeof t.amount === 'number')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE' && typeof t.amount === 'number')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const totalInvested = investments
    .filter(inv => typeof inv.currentValue === 'number')
    .reduce((sum, inv) => sum + inv.currentValue, 0);


  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTransactionMutation.mutate(data, {
      onSuccess: (newTransaction) => {
        setIsTransactionFormOpen(false);
        setEditingTransaction(null);
        toast({
          title: "Transação Adicionada",
          description: `"${newTransaction.description}" foi adicionada com sucesso.`
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao adicionar transação",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const handleEditTransaction = (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTransaction) return;

    const updatedTransaction: Transaction = {
      ...editingTransaction,
      ...data,
    };

    updateTransactionMutation.mutate(updatedTransaction, {
      onSuccess: () => {
        setIsTransactionFormOpen(false);
        setEditingTransaction(null);
        toast({
          title: "Transação Atualizada",
          description: `"${updatedTransaction.description}" foi atualizada.`
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao atualizar transação",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const openEditTransactionForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionFormOpen(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    deleteTransactionMutation.mutate(transactionId, {
      onSuccess: () => {
        toast({
          title: "Transação Excluída",
          description: `"${transaction.description}" foi excluída.`,
          variant: "destructive"
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao excluir transação",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };
  const handleAddInvestment = (data: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => {
    addInvestmentMutation.mutate(data, {
      onSuccess: (newInvestment) => {
        setIsInvestmentFormOpen(false);
        setEditingInvestment(null);
        toast({
          title: "Investimento Adicionado",
          description: `"${newInvestment.name}" foi adicionado.`
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao adicionar investimento",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const handleEditInvestment = (data: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingInvestment) return;

    const updatedInvestment: Investment = {
      ...editingInvestment,
      ...data
    };

    updateInvestmentMutation.mutate(updatedInvestment, {
      onSuccess: () => {
        setIsInvestmentFormOpen(false);
        setEditingInvestment(null);
        toast({
          title: "Investimento Atualizado",
          description: `"${updatedInvestment.name}" foi atualizado.`
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao atualizar investimento",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const openEditInvestmentForm = (investment: Investment) => {
    setEditingInvestment(investment);
    setIsInvestmentFormOpen(true);
  };

  const handleDeleteInvestment = (investmentId: string) => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment) return;

    deleteInvestmentMutation.mutate(investmentId, {
      onSuccess: () => {
        toast({
          title: "Investimento Excluído",
          description: `"${investment.name}" foi excluído.`,
          variant: "destructive"
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao excluir investimento",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  return (
    <AppLayout pageTitle="Gerenciar Finanças">
      <TooltipProvider>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingTransactions ? (
                  <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                ) : (<div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {isLoadingTransactions
                    ? "Carregando..."
                    : `R$${typeof balance === 'number' ? balance.toFixed(2) : "0.00"}`}
                </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receitas (Mês)</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {isLoadingTransactions
                    ? "Carregando..."
                    : `R$${typeof totalIncome === 'number' ? totalIncome.toFixed(2) : "0.00"}`}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesas (Mês)</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {isLoadingTransactions
                    ? "Carregando..."
                    : `R$${typeof totalExpenses === 'number' ? totalExpenses.toFixed(2) : "0.00"}`}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {isLoadingInvestments
                    ? "Carregando..."
                    : `R$${typeof totalInvested === 'number' ? totalInvested.toFixed(2) : "0.00"}`}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Histórico de Transações</CardTitle>
                <CardDescription>Todas as suas receitas e despesas listadas.</CardDescription>
              </div>
              <Dialog open={isTransactionFormOpen} onOpenChange={(isOpen) => {
                setIsTransactionFormOpen(isOpen);
                if (!isOpen) setEditingTransaction(null);
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingTransaction(null); setIsTransactionFormOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Transação
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-headline">
                      {editingTransaction ? 'Editar Transação' : 'Adicionar Nova Transação'}
                    </DialogTitle>
                  </DialogHeader>
                  <TransactionForm
                    transaction={editingTransaction}
                    onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
                    onCancel={() => { setIsTransactionFormOpen(false); setEditingTransaction(null); }}
                  />
                </DialogContent>
              </Dialog>            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-gray-200 animate-pulse rounded"></div>
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <DollarSign className="mx-auto h-12 w-12 mb-4" />
                  Nenhuma transação registrada ainda.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">
                          {t.description}
                          {t.isRecurring && t.recurrenceInterval && t.recurrenceInterval !== 'NONE' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Repeat2 className="ml-1.5 h-4 w-4 inline text-primary cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Recorrente: {recurrenceOptions.find(opt => opt.value === t.recurrenceInterval)?.label || t.recurrenceInterval}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}                        </TableCell>                      <TableCell className={t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                          {t.type === 'INCOME' ? '+' : '-'} R${typeof t.amount === 'number' ? t.amount.toFixed(2) : '0.00'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={t.type === 'INCOME' ? 'default' : 'destructive'} className="capitalize">
                            {transactionTypeOptions.find(opt => opt.value === t.type)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isValid(parseISO(t.date)) ? format(parseISO(t.date), "dd/MM/yyyy", { locale: ptBR }) : 'Data inválida'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{t.category || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditTransactionForm(t)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Confirmar Exclusão</DialogTitle>                              </DialogHeader>
                              <p>Tem certeza que deseja excluir a transação "{t.description}" no valor de R${typeof t.amount === 'number' ? t.amount.toFixed(2) : '0.00'}?</p>
                              <DialogFooter>
                                <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                                <Button variant="destructive" onClick={() => handleDeleteTransaction(t.id)}>Excluir Transação</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Meus Investimentos
                </CardTitle>
                <CardDescription>Acompanhe a evolução dos seus ativos financeiros.</CardDescription>
              </div>
              <Dialog open={isInvestmentFormOpen} onOpenChange={(isOpen) => {
                setIsInvestmentFormOpen(isOpen);
                if (!isOpen) setEditingInvestment(null);
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingInvestment(null); setIsInvestmentFormOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Investimento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-headline">
                      {editingInvestment ? 'Editar Investimento' : 'Adicionar Novo Investimento'}
                    </DialogTitle>
                  </DialogHeader>
                  <InvestmentForm
                    investment={editingInvestment}
                    onSubmit={editingInvestment ? handleEditInvestment : handleAddInvestment}
                    onCancel={() => { setIsInvestmentFormOpen(false); setEditingInvestment(null); }}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>            <CardContent>
              {isLoadingInvestments ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-gray-200 animate-pulse rounded"></div>
                  ))}
                </div>
              ) : investments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="mx-auto h-12 w-12 mb-4 opacity-70" />
                  <p className="text-lg font-medium">Nenhum investimento registrado.</p>
                  <p className="text-sm">Adicione seus ativos para começar a acompanhar.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ativo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Valor Atual (R$)</TableHead>
                      <TableHead>Data da Compra</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((inv) => {
                      const TypeIcon = investmentTypeOptions.find(opt => opt.value === inv.type)?.icon || Briefcase;
                      return (
                        <TableRow key={inv.id}>
                          <TableCell className="font-medium">{inv.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                              <TypeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              {investmentTypeOptions.find(opt => opt.value === inv.type)?.label || inv.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-blue-600">
                            {inv.currentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TableCell>
                          <TableCell>
                            {isValid(parseISO(inv.purchaseDate)) ? format(parseISO(inv.purchaseDate), "dd/MM/yyyy", { locale: ptBR }) : 'Data inválida'}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditInvestmentForm(inv)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Excluir</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader><DialogTitle>Confirmar Exclusão</DialogTitle></DialogHeader>
                                <p>Tem certeza que deseja excluir o investimento "{inv.name}"?</p>
                                <DialogFooter>
                                  <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                                  <Button variant="destructive" onClick={() => handleDeleteInvestment(inv.id)}>Excluir Investimento</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

        </div>
      </TooltipProvider>
    </AppLayout>
  );
}
