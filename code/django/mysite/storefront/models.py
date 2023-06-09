from django.db import models
from django.utils import timezone

# Create your models here.
class Item(models.Model):
    itemID = models.AutoField(primary_key = True)
    description = models.CharField(max_length=100)
    cost = models.DecimalField(max_digits = 10 ,decimal_places = 2)
    sellingPrice = models.DecimalField(max_digits = 10, decimal_places = 2)
    note = models.CharField(max_length=250)
    supplierID = models.CharField(max_length = 100,null=True, blank=True)
    classification = models.CharField(max_length=20, null = True)#will change null to false later
    barcode = models.BigIntegerField(null= True)
    def __str__(self):
        return self.description

class Supplier(models.Model):
    supplierID = models.AutoField(primary_key=True)
    company = models.CharField(max_length = 30)
    email = models.CharField(max_length = 30)
    phoneNum = models.CharField(max_length= 15)
    country = models.CharField(max_length = 30)
    street = models.CharField(max_length = 30)
    city = models.CharField(max_length = 30)
    state = models.CharField(max_length = 30)
    zip = models.IntegerField()
    note = models.CharField(max_length = 300)
    def __str__(self):
        return self.company

class Customer(models.Model):
    customerID = models.AutoField(primary_key=True)
    firstName = models.CharField(max_length=20)
    lastName = models.CharField(max_length=20)
    email = models.CharField(max_length = 30)
    phoneNum = models.CharField(max_length= 15)
    country = models.CharField(max_length = 30)
    street = models.CharField(max_length = 30)
    city = models.CharField(max_length = 30)
    state = models.CharField(max_length = 30)
    zip = models.IntegerField()
    note = models.CharField(max_length = 300)
    def __str__(self):
        return self.email

class Shipment(models.Model):
    shipID = models.AutoField(primary_key=True)
    trackingNo = models.CharField(max_length=30)
    shipDate = models.DateField()
    note = models.CharField(max_length = 300)
    def __str__(self):
        return self.shipID

class Inventory(models.Model):
    stackID = models.AutoField(primary_key=True)
    itemID = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    expirationDate = models.DateField()
    inboundDate = models.DateField()
    lowQuantity = models.IntegerField(null=False, default= 1)

    # function to add item description to inventory table
    def itemDescription(self):
        return self.itemID.description

    def __str__(self):
        return self.stackID
 

class GoodsReceipt(models.Model):
    recID = models.AutoField(primary_key=True)
    supplierID = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    shipmentDate = models.DateField()
    cost = models.DecimalField(max_digits = 10 ,decimal_places = 2)
    trackingNo = models.CharField(max_length=30)
    note = models.CharField(max_length = 300)
    def __str__(self):
        return self.recID

class Order(models.Model):
    orderID = models.AutoField(primary_key=True)
    itemID = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    orderDate = models.DateField()
    orderPrice = models.DecimalField(max_digits=11, decimal_places=2)
    customerID = models.ForeignKey(Customer, on_delete=models.CASCADE)
    shipID = models.ForeignKey(Shipment,null=True, on_delete=models.CASCADE)
    def __str__(self):
        return self.orderID

class Order_Top_Customer(models.Model):
    reportID = models.AutoField(primary_key=True)
    customerID = models.CharField(max_length=10)
    totalOrders = models.IntegerField()
    totalSpent = models.DecimalField(max_digits = 11, decimal_places=2)
    averageOrderPrice = models.DecimalField(max_digits = 11, decimal_places=2)
    created_at = models.DateField(default=timezone.now)
    def __str__(self):
       return self.reportID

