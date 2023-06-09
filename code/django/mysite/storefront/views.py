import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
# from rest_framework.permissions import IsAuthenticated
from django.http import *
from datetime import datetime
import requests
import json



from .models import *
from .serializer import *


# Create your views here.

class ItemView(APIView):
    # permission_classes = (IsAuthenticated,)
    def get(self, request: Request):
        items = Item.objects.all()
        serialized_item = ItemSerializer(items, many=True)
        return Response(serialized_item.data)


class FindItemView(APIView):

    def get(self, request: Request, pk):
        items = Item.objects.get(pk=pk)
        serialized_item = ItemSerializer(items, many=False)
        return Response(serialized_item.data)


class AddItemView(APIView):

    def post(self, request: Request):
        item = ItemSerializer(data=request.data)
        if item.is_valid():
            item.save()
            return Response(item.data)
        else:
            return Response(item.errors)


class UpdateItemView(APIView):

    def put(self, request: Request, pk):
        item = Item.objects.get(pk=pk)
        item_serializer = ItemSerializer(item, data=request.data)
        if item_serializer.is_valid():
            item_serializer.save()
            return Response(item_serializer.data)
        else:
            return Response(item_serializer.errors)


class DeleteItemView(APIView):

    def delete(self, request: Request, pk):
        item = Item.objects.get(pk=pk)
        item.delete()
        return Response("Item deleted")


class SupplierView(APIView):

    def get(self, request: Request):
        suppliers = Supplier.objects.all()
        serialized_supplier = SupplierSerializer(suppliers, many=True)
        return Response(serialized_supplier.data)


class FindSupplierView(APIView):

    def get(self, request: Request, pk):
        suppliers = Supplier.objects.get(pk=pk)
        serialized_supplier = SupplierSerializer(suppliers, many=False)
        return Response(serialized_supplier.data)


class AddSupplierView(APIView):

    def post(self, request: Request):
        supplier = SupplierSerializer(data=request.data)
        if supplier.is_valid():
            supplier.save()
            return Response(supplier.data)
        else:
            return Response(supplier.errors)


class UpdateSupplierView(APIView):

    def put(self, request: Request, pk):
        supplier = Supplier.objects.get(pk=pk)
        supplier_serializer = SupplierSerializer(supplier, data=request.data)
        if supplier_serializer.is_valid():
            supplier_serializer.save()
            return Response(supplier_serializer.data)
        else:
            return Response(supplier_serializer.errors)


class DeleteSupplierView(APIView):

    def delete(self, request: Request, pk):
        supplier = Supplier.objects.get(pk=pk)
        supplier.delete()
        return Response("Supplier deleted")


class CustomerView(APIView):
    def get(self, request: Request):
        customers = Customer.objects.all()
        serialized_customer = CustomerSerializer(customers, many=True)
        return Response(serialized_customer.data)


class ShipmentView(APIView):
    def get(self, request: Request):
        shipments = Shipment.objects.all()
        serialized_shipment = ShipmentSerializer(shipments, many=True)
        return Response(serialized_shipment.data)


class InventoryView(APIView):
    def get(self, request: Request):
        inventory = Inventory.objects.all()
        serialized_inventory = InventorySerializer(inventory, many=True)
        return Response(serialized_inventory.data)


class GoodsReceiptView(APIView):
    def get(self, request: Request):
        goodsreceipt = GoodsReceipt.objects.all()
        serialized_goodsreceipt = GoodsReceiptSerializer(goodsreceipt, many=True)
        return Response(serialized_goodsreceipt.data)


class OrderView(APIView):
    def get(self, request: Request):
        orders = Order.objects.all()
        serialized_order = OrderSerializer(orders, many=True)
        return Response(serialized_order.data)


class FindOrderView(APIView):

    def get(self, request: Request, pk):
        orders = Order.objects.get(pk=pk)
        serialized_order = OrderSerializer(orders, many=False)
        return Response(serialized_order.data)


class AddOrderView(APIView):

    def post(self, request: Request):
        order = OrderSerializer(data=request.data)
        if order.is_valid():
            order.save()
            return Response(order.data)
        else:
            return Response(order.errors)


class UpdateOrderView(APIView):

    def put(self, request: Request, pk):
        order = Order.objects.get(pk=pk)
        order_serializer = OrderSerializer(order, data=request.data)
        if order_serializer.is_valid():
            order_serializer.save()
            return Response(order_serializer.data)
        else:
            return Response(order_serializer.errors)


class DeleteOrderView(APIView):

    def delete(self, request: Request, pk):
        order = Order.objects.get(pk=pk)
        order.delete()
        return Response("Order deleted")


class CashtView(APIView):
    def post(self, request: Request):
        arr = request.data
        for e in arr:
            itemId = e['itemId']
            quantity = e['quantity']
            inventory = Inventory.objects.filter(itemID=itemId).first()
            inventory2 = InventorySerializer(inventory).data
            if inventory2 is None or inventory2['quantity'] is None or inventory2['quantity'] < int(quantity):
                return Response({"code": 1, "msg": "Inventory shortage"})
        now = datetime.now()
        no = now.strftime("%Y%m%d%H%M%S%f")
        s = Shipment(trackingNo=no, shipDate=now, note="")
        # shipment = ShipmentSerializer(data=s)
        # if shipment.is_valid():
        #     shipment.save()
        s.save()
        cusId = 1
        customer = Customer.objects.filter(customerID=cusId).first()
        for e in arr:
            itemId = e['itemId']
            quantity = e['quantity']
            sellingPrice = e['sellingPrice']
            item = Item.objects.filter(itemID=itemId).first()
            inventory = Inventory.objects.filter(itemID=itemId).first()
            inventory2 = InventorySerializer(inventory).data
            o = Order(shipID=s, quantity=quantity, itemID=item, orderPrice=sellingPrice, orderDate=now, customerID=customer, customerID_id=cusId)
            # order = OrderSerializer(data=o)
            # if order.is_valid():
            #     order.save()
            o.save()
            count = inventory2['quantity'] - int(quantity)
            Inventory.objects.filter(stackID=inventory2['stackID']).update(quantity=count)
        return Response({"code": 0, "msg": "Submission successful"})
    


def scanned_barcode_lookup(request, barcode):
    #https://api.barcodelookup.com/v3/products?barcode=3614272049529&formatted=y&key=your_api_key
    
    access_key = 'r1yq3ytcgn3pqaolto4qebnu5bw6ek'
    url = f'https://api.barcodelookup.com/v3/products?barcode={barcode}&key={access_key}'

    response = requests.get(url)
    json_data_obj = response.json()
    
    product_details = json_data_obj['products'][0]
    
    stores = product_details['stores']
    total_price = 0.00
    num_stores = len(stores)
    for store in stores:
        total_price += float(store['price'])

    average_price = total_price/num_stores

    product = {
        'title' : product_details['title'],
        'description' : product_details['description'],
        'price' : average_price,
        'category' : product_details['category'].split('>', 1)[1].strip().split('>', 1)[0].strip(),

        #can return more if we want
    }

    json_dict = {'products': product}
    json_data = json.dumps(json_dict)

    return HttpResponse(json_data, content_type='application/json' )


def scanned_barcode_lookup_test(request):
    barcode = '013000006057'
    #https://api.barcodelookup.com/v3/products?barcode=3614272049529&formatted=y&key=your_api_key
    
    access_key = 'r1yq3ytcgn3pqaolto4qebnu5bw6ek'
    url = f'https://api.barcodelookup.com/v3/products?barcode={barcode}&key={access_key}'

    response = requests.get(url)
    json_data_obj = response.json()
    
    product_details = json_data_obj['products'][0]
    
    stores = product_details['stores']
    total_price = 0.00
    num_stores = len(stores)
    for store in stores:
        total_price += float(store['price'])

    average_price = total_price/num_stores

    product = {
        'title' : product_details['title'],
        'price' : average_price,
        'category' : product_details['category'].split('>', 1)[1].strip().split('>', 1)[0].strip(),

        #can return more if we want
    }

    json_dict = {'products': product}
    json_data = json.dumps(json_dict)

    return HttpResponse(json_data, content_type='application/json' )
