import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Create a new sale
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body; // items: [{ itemId, itemName, quantity, unitPrice, totalPrice }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.totalPrice,
      0
    );

    // Generate invoice number in format: INV-YYYYMMDD-XXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    
    // Find the last invoice number for today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    
    // Get all sales from today
    const todaySales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      select: {
        invoiceNumber: true,
      },
      orderBy: {
        invoiceNumber: "desc",
      },
    });
    
    // Find the highest sequence number for today
    let nextSequence = 1;
    const todayPrefix = `INV-${dateStr}-`;
    
    if (todaySales.length > 0) {
      // Parse existing invoice numbers to find the highest sequence
      const sequences = todaySales
        .map((sale) => {
          if (sale.invoiceNumber.startsWith(todayPrefix)) {
            const sequenceStr = sale.invoiceNumber.replace(todayPrefix, "");
            const sequence = parseInt(sequenceStr, 10);
            return isNaN(sequence) ? 0 : sequence;
          }
          return 0;
        })
        .filter((seq) => seq > 0);
      
      if (sequences.length > 0) {
        nextSequence = Math.max(...sequences) + 1;
      }
    }
    
    // Format sequence as 3-digit number (001, 002, etc.)
    const sequenceStr = nextSequence.toString().padStart(3, "0");
    const invoiceNumber = `${todayPrefix}${sequenceStr}`;

    // Create sale with items
    const sale = await prisma.sale.create({
      data: {
        invoiceNumber,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            plateType: item.plateType || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Update stock for each item
    for (const item of items) {
      const currentItem = await prisma.item.findUnique({
        where: { id: item.itemId },
      });
      
      if (currentItem) {
        await prisma.item.update({
          where: { id: item.itemId },
          data: {
            stock: Math.max(0, currentItem.stock - item.quantity),
          },
        });
      }
    }

    return NextResponse.json(sale, { status: 201 });
  } catch (error: any) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: "Failed to create sale", details: error.message },
      { status: 500 }
    );
  }
}

// GET - Get all sales (for admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const date = searchParams.get("date"); // Format: YYYY-MM-DD

    // Build where clause for date filtering
    let whereClause: any = {};
    if (date) {
      const dateObj = new Date(date);
      const startOfDay = new Date(dateObj);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateObj);
      endOfDay.setHours(23, 59, 59, 999);

      whereClause.saleDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const sales = await prisma.sale.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy: {
        saleDate: "desc",
      },
      include: {
        items: true,
      },
    });

    const total = await prisma.sale.count({
      where: whereClause,
    });

    // Calculate total revenue across all sales (not just current page)
    const allSalesForTotal = await prisma.sale.findMany({
      where: whereClause,
      select: {
        totalAmount: true,
      },
    });
    const totalRevenue = allSalesForTotal.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0
    );

    return NextResponse.json({
      sales,
      total,
      totalRevenue,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}

