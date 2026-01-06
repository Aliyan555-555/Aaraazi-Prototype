import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Badge } from "./ui/badge";
import { User, Property, Contact } from "../types";
import {
  addProperty,
  getContacts,
  updateProperty,
} from "../lib/data";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Search,
} from "lucide-react";
import { QuickAddContactModal } from "./QuickAddContactModal";
import { toast } from "sonner";

interface PropertyFormProps {
  user: User;
  onBack: () => void;
  onSuccess: () => void;
  acquisitionType:
    | "client-listing"
    | "agency-purchase"
    | "investor-purchase";
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  user,
  onBack,
  onSuccess,
  acquisitionType,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<
    Contact[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showContactDropdown, setShowContactDropdown] =
    useState(false);
  const [editingProperty, setEditingProperty] =
    useState<Property | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [investors, setInvestors] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    currentOwnerId: "",
    title: "",
    address: "",
    price: "",
    listingType: "for-sale" as
      | "for-sale"
      | "for-rent"
      | "wanted",
    // Rental-specific fields
    monthlyRent: "",
    securityDeposit: "",
    leaseDuration: "",
    advanceRentMonths: "",
    maintenanceFee: "",
    availabilityDate: "",
    propertyType: "house" as
      | "house"
      | "apartment"
      | "commercial"
      | "land",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    images: [] as string[],
    isPublished: false,
    isAnonymous: false,
    isFeatured: false,
    featuredUntil: "",
    expiryDate: "",
    commissionRate: "3",
    // Purchase details for agency/investor purchases
    purchasePrice: "",
    associatedCosts: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    paymentSource: "",
    assignedInvestors: [] as string[],
    investorAllocations: {} as Record<
      string,
      { investmentAmount: string; ownershipShare: string }
    >,
  });

  // Load contacts and investors on component mount
  useEffect(() => {
    const allContacts = getContacts(user.id, user.role);
    setContacts(allContacts);
    setFilteredContacts(allContacts);

    // Load investors if investor-purchase type
    if (acquisitionType === "investor-purchase") {
      import("../lib/investors")
        .then(({ getInvestors }) => {
          const allInvestors = getInvestors(user.id);
          setInvestors(allInvestors);
        })
        .catch((err) => {
          console.error("Error loading investors:", err);
          setInvestors([]);
        });
    }
  }, [user.id, user.role, acquisitionType]);

  // Separate effect for loading editing property (only once on mount)
  useEffect(() => {
    // Check if we're editing a property
    const editingPropertyData = localStorage.getItem(
      "editing_property",
    );
    if (editingPropertyData) {
      try {
        const property: Property = JSON.parse(
          editingPropertyData,
        );
        setEditingProperty(property);
        setIsEditMode(true);

        // Populate form with existing property data
        setFormData({
          currentOwnerId: property.currentOwnerId || "",
          title: property.title,
          address: property.address,
          price: property.price?.toString() || "",
          listingType: property.listingType || "for-sale",
          monthlyRent: property.monthlyRent?.toString() || "",
          securityDeposit:
            property.securityDeposit?.toString() || "",
          leaseDuration:
            property.leaseDuration?.toString() || "",
          propertyType: property.propertyType,
          bedrooms: property.bedrooms?.toString() || "",
          bathrooms: property.bathrooms?.toString() || "",
          area: property.area.toString(),
          description: property.description,
          images: property.images || [],
          isPublished: property.isPublished || false,
          isAnonymous: property.isAnonymous || false,
          isFeatured: property.isFeatured || false,
          featuredUntil: property.featuredUntil || "",
          expiryDate: property.expiryDate || "",
          commissionRate:
            property.commissionRate?.toString() || "3",
          purchasePrice:
            property.purchaseDetails?.purchasePrice?.toString() ||
            "",
          associatedCosts:
            property.purchaseDetails?.associatedCosts?.toString() ||
            "",
          purchaseDate:
            property.purchaseDetails?.purchaseDate ||
            new Date().toISOString().split("T")[0],
          paymentSource:
            property.purchaseDetails?.paymentSource || "",
          investorAllocations: {},
          assignedInvestors:
            property.purchaseDetails?.assignedInvestors || [],
        });

        // Clear the localStorage after loading
        localStorage.removeItem("editing_property");
      } catch (error) {
        console.error(
          "Error loading property for editing:",
          error,
        );
        toast.error("Error loading property data");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const steps = [
    "Property Details",
    "Media & Publishing",
    "Review & Submit",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle contact search
  const handleContactSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredContacts(contacts);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(lowerQuery) ||
          (contact.phone &&
            contact.phone.toLowerCase().includes(lowerQuery)) ||
          (contact.email &&
            contact.email.toLowerCase().includes(lowerQuery)),
      );
      setFilteredContacts(filtered);
    }
  };

  // Handle contact selection
  const handleContactSelect = (contactId: string) => {
    setFormData((prev) => ({
      ...prev,
      currentOwnerId: contactId,
    }));
    setShowContactDropdown(false);
    setSearchQuery("");
    setFilteredContacts(contacts);
  };

  // Get selected contact
  const selectedContact = contacts.find(
    (c) => c.id === formData.currentOwnerId,
  );

  // Handle contact added from quick add modal
  const handleContactAdded = (newContact: Contact) => {
    setContacts((prev) => [...prev, newContact]);
    setFilteredContacts((prev) => [...prev, newContact]);
    setFormData((prev) => ({
      ...prev,
      currentOwnerId: newContact.id,
    }));
  };

  const handleImageAdd = () => {
    // Simulate image upload - in real app, this would handle file upload
    const sampleImages = [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc1NjU2MDU2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1751998816246-c63d182770c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTY1ODcwMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ];
    const randomImage =
      sampleImages[
        Math.floor(Math.random() * sampleImages.length)
      ];
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, randomImage],
    }));
  };

  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    // Validate current owner is selected
    if (!formData.currentOwnerId) {
      toast.error("Please select a current property owner");
      return;
    }

    const ownerContact = contacts.find(
      (c) => c.id === formData.currentOwnerId,
    );

    const baseData: any = {
      ...formData,
      listingType: formData.listingType,
      bedrooms: formData.bedrooms
        ? parseInt(formData.bedrooms)
        : undefined,
      bathrooms: formData.bathrooms
        ? parseInt(formData.bathrooms)
        : undefined,
      area: parseFloat(formData.area),
      commissionRate: parseFloat(formData.commissionRate),
      currentOwnerId: formData.currentOwnerId,
      isFeatured: formData.isFeatured,
      featuredUntil: formData.featuredUntil || undefined,
      expiryDate: formData.expiryDate || undefined,
    };

    // Add listing-type specific fields
    if (
      formData.listingType === "for-sale" ||
      formData.listingType === "wanted"
    ) {
      baseData.price = parseFloat(formData.price);
    } else if (formData.listingType === "for-rent") {
      baseData.monthlyRent = parseFloat(formData.monthlyRent);
      baseData.securityDeposit = parseFloat(
        formData.securityDeposit || "0",
      );
      baseData.leaseDuration = parseInt(
        formData.leaseDuration || "11",
      );
      if (formData.advanceRentMonths) {
        baseData.advanceRentMonths = parseInt(formData.advanceRentMonths);
      }
      if (formData.maintenanceFee) {
        baseData.maintenanceFee = parseFloat(formData.maintenanceFee);
      }
      if (formData.availabilityDate) {
        baseData.availabilityDate = formData.availabilityDate;
      }
    }

    // Add purchase details for agency/investor purchases (only for new properties)
    if (!isEditMode && acquisitionType !== "client-listing") {
      const purchasePrice = parseFloat(formData.purchasePrice);
      const associatedCosts = parseFloat(
        formData.associatedCosts || "0",
      );

      baseData.purchaseDetails = {
        purchasePrice,
        associatedCosts,
        totalCostBasis: purchasePrice + associatedCosts,
        purchaseDate: formData.purchaseDate,
        paymentSource: formData.paymentSource,
        assignedInvestors:
          acquisitionType === "investor-purchase"
            ? formData.assignedInvestors
            : undefined,
      };

      // Save investor allocations for investor-purchase type
      if (
        acquisitionType === "investor-purchase" &&
        formData.assignedInvestors.length > 0
      ) {
        // Import savePropertyInvestment function
        import("../lib/investors")
          .then(({ savePropertyInvestment }) => {
            formData.assignedInvestors.forEach((investorId) => {
              const allocation =
                formData.investorAllocations[investorId];
              if (
                allocation &&
                allocation.investmentAmount &&
                allocation.ownershipShare
              ) {
                const investment = {
                  id: `inv-${Date.now()}-${investorId}`,
                  investorId,
                  propertyId: "", // Will be set after property is created
                  investmentAmount: parseFloat(
                    allocation.investmentAmount,
                  ),
                  ownershipPercentage: parseFloat(
                    allocation.ownershipShare,
                  ),
                  investmentDate: formData.purchaseDate,
                  status: "active" as const,
                  notes: `Investment in property: ${formData.title}`,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                // Note: We'll need to save this after property is created
                // Store temporarily for post-creation
                if (!(window as any)._tempInvestments) {
                  (window as any)._tempInvestments = [];
                }
                (window as any)._tempInvestments.push(
                  investment,
                );
              }
            });
          })
          .catch((err) =>
            console.error(
              "Error loading investor module:",
              err,
            ),
          );
      }
    }

    if (isEditMode && editingProperty) {
      // Update existing property
      updateProperty(editingProperty.id, baseData);
      localStorage.removeItem("editing_property");
      toast.success("Property updated successfully!");
    } else {
      // Create new property
      const propertyData: any = {
        ...baseData,
        agentId: user.id,
        agentName: user.name,
        sharedWith: [] as string[],
        status: "available" as const,
        acquisitionType,
        ownershipHistory: ownerContact
          ? [
              {
                contactId: ownerContact.id,
                contactName: ownerContact.name,
                startDate: new Date()
                  .toISOString()
                  .split("T")[0],
                notes: `Initial property owner when added to system`,
              },
            ]
          : [],
      };
      addProperty(propertyData);
      toast.success(
        "Property added successfully with ownership tracking!",
      );
    }

    onSuccess();
  };

  // Calculate total cost basis
  const totalCostBasis = (
    parseFloat(formData.purchasePrice || "0") +
    parseFloat(formData.associatedCosts || "0")
  ).toFixed(2);

  // Mock bank accounts for payment source
  const bankAccounts = [
    {
      id: "acc-1",
      name: "Standard Chartered - Business Account (****1234)",
      balance: "PKR 5,500,000",
    },
    {
      id: "acc-2",
      name: "HBL - Operations Account (****5678)",
      balance: "PKR 8,200,000",
    },
    {
      id: "acc-3",
      name: "MCB - Investment Account (****9012)",
      balance: "PKR 12,750,000",
    },
    {
      id: "acc-4",
      name: "UBL - Petty Cash (****3456)",
      balance: "PKR 450,000",
    },
  ];

  const handleInvestorToggle = (investorId: string) => {
    setFormData((prev) => {
      const isCurrentlySelected =
        prev.assignedInvestors.includes(investorId);
      const newAssignedInvestors = isCurrentlySelected
        ? prev.assignedInvestors.filter(
            (id) => id !== investorId,
          )
        : [...prev.assignedInvestors, investorId];

      // Initialize allocation with empty strings when investor is added
      const newAllocations = { ...prev.investorAllocations };
      if (!isCurrentlySelected && !newAllocations[investorId]) {
        newAllocations[investorId] = {
          investmentAmount: "",
          ownershipShare: "",
        };
      }

      return {
        ...prev,
        assignedInvestors: newAssignedInvestors,
        investorAllocations: newAllocations,
      };
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Property Owner Section - REQUIRED FIRST */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Property Owner</CardTitle>
                <p className="text-sm text-gray-600">
                  Select the current owner of this property from
                  your CRM contacts
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentOwner">
                    Current Owner{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      {/* Selected Contact Display or Search Input */}
                      {formData.currentOwnerId &&
                      selectedContact ? (
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                          <div className="flex-1">
                            <p className="font-medium">
                              {selectedContact.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {selectedContact.phone}
                              {selectedContact.email &&
                                ` • ${selectedContact.email}`}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                currentOwnerId: "",
                              }));
                              setShowContactDropdown(true);
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="currentOwner"
                              placeholder="Search contacts by name, phone, or email..."
                              value={searchQuery}
                              onChange={(e) =>
                                handleContactSearch(
                                  e.target.value,
                                )
                              }
                              onFocus={() =>
                                setShowContactDropdown(true)
                              }
                              className="pl-10"
                            />
                          </div>

                          {/* Contact Dropdown */}
                          {showContactDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                              {filteredContacts.length > 0 ? (
                                filteredContacts.map(
                                  (contact) => (
                                    <button
                                      key={contact.id}
                                      type="button"
                                      className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                                      onClick={() =>
                                        handleContactSelect(
                                          contact.id,
                                        )
                                      }
                                    >
                                      <p className="font-medium">
                                        {contact.name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {contact.phone}
                                        {contact.email &&
                                          ` • ${contact.email}`}
                                      </p>
                                      {contact.category && (
                                        <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                          {contact.category}
                                        </span>
                                      )}
                                    </button>
                                  ),
                                )
                              ) : (
                                <div className="p-4 text-center text-gray-500">
                                  {contacts.length === 0 ? (
                                    <>
                                      <p>
                                        No contacts found in CRM
                                      </p>
                                      <p className="text-sm mt-1">
                                        Click "Quick Add
                                        Contact" to add a new
                                        contact
                                      </p>
                                    </>
                                  ) : (
                                    <p>
                                      No contacts match your
                                      search
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Quick Add Contact Button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowQuickAdd(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Quick Add Contact
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {acquisitionType === "client-listing"
                      ? "Select the client (seller) who owns this property"
                      : "For agency/investor purchases, this will be automatically set to your agency"}
                  </p>
                </div>

                {/* Validation Warning */}
                {!formData.currentOwnerId && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-yellow-600 mt-0.5">
                      ⚠️
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-yellow-900 font-medium">
                        Owner Required
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        You must select or add a property owner
                        before proceeding. This enables
                        ownership tracking throughout the
                        property lifecycle.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Purchase & Financial Details Section - Only for purchases */}
            {acquisitionType !== "client-listing" && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Purchase & Financial Details</span>
                    <Badge
                      variant="outline"
                      className="bg-white"
                    >
                      {acquisitionType === "agency-purchase"
                        ? "Agency Purchase"
                        : "Investor Purchase"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">
                        Purchase Price (PKR)*
                      </Label>
                      <Input
                        id="purchasePrice"
                        type="number"
                        value={formData.purchasePrice}
                        onChange={(e) =>
                          handleInputChange(
                            "purchasePrice",
                            e.target.value,
                          )
                        }
                        placeholder="0"
                        required
                      />
                      <p className="text-xs text-gray-600">
                        The agreed purchase price for this
                        property
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="associatedCosts">
                        Associated Costs (PKR)
                      </Label>
                      <Input
                        id="associatedCosts"
                        type="number"
                        value={formData.associatedCosts}
                        onChange={(e) =>
                          handleInputChange(
                            "associatedCosts",
                            e.target.value,
                          )
                        }
                        placeholder="0"
                      />
                      <p className="text-xs text-gray-600">
                        Taxes, legal fees, registration, etc.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        Total Cost Basis
                      </span>
                      <span className="text-xl font-medium text-blue-600">
                        PKR{" "}
                        {totalCostBasis === "0.00"
                          ? "0"
                          : parseFloat(
                              totalCostBasis,
                            ).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Purchase Price + Associated Costs
                      (Auto-calculated)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchaseDate">
                        Purchase Date*
                      </Label>
                      <Input
                        id="purchaseDate"
                        type="date"
                        value={formData.purchaseDate}
                        onChange={(e) =>
                          handleInputChange(
                            "purchaseDate",
                            e.target.value,
                          )
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentSource">
                        Payment Source*
                      </Label>
                      <Select
                        value={formData.paymentSource}
                        onValueChange={(value) =>
                          handleInputChange(
                            "paymentSource",
                            value,
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank account" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankAccounts.map((account) => (
                            <SelectItem
                              key={account.id}
                              value={account.id}
                            >
                              <div className="flex flex-col">
                                <span>{account.name}</span>
                                <span className="text-xs text-gray-500">
                                  {account.balance}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-600">
                        Select the bank account for payment
                      </p>
                    </div>
                  </div>

                  {/* Investor Assignment - Only for investor-purchase */}
                  {acquisitionType === "investor-purchase" && (
                    <div className="space-y-4 pt-4 border-t border-blue-200">
                      <div>
                        <Label>
                          Assign Investors & Define Investment
                          Details*
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Select investors and specify their
                          investment amount and ownership share
                        </p>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {investors.map((investor) => {
                          const isSelected =
                            formData.assignedInvestors.includes(
                              investor.id,
                            );
                          const allocation = formData
                            .investorAllocations[
                            investor.id
                          ] || {
                            investmentAmount: "",
                            ownershipShare: "",
                          };

                          return (
                            <div
                              key={investor.id}
                              className={`border rounded-lg p-4 transition-all ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() =>
                                    handleInvestorToggle(
                                      investor.id,
                                    )
                                  }
                                  className="h-4 w-4 text-blue-600 rounded mt-1"
                                />
                                <div className="flex-1 space-y-3">
                                  <div>
                                    <p className="font-medium">
                                      {investor.name}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      Email:{" "}
                                      {investor.email || "N/A"}{" "}
                                      • Phone: {investor.phone}
                                    </p>
                                  </div>

                                  {isSelected && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-blue-200">
                                      <div className="space-y-1">
                                        <Label
                                          htmlFor={`investment-${investor.id}`}
                                          className="text-xs"
                                        >
                                          Investment Amount
                                          (PKR)*
                                        </Label>
                                        <Input
                                          id={`investment-${investor.id}`}
                                          type="number"
                                          placeholder="0"
                                          value={
                                            allocation.investmentAmount ||
                                            ""
                                          }
                                          onChange={(e) => {
                                            const newAllocations =
                                              {
                                                ...formData.investorAllocations,
                                              };
                                            newAllocations[
                                              investor.id
                                            ] = {
                                              ...newAllocations[
                                                investor.id
                                              ],
                                              investmentAmount:
                                                e.target.value,
                                            };
                                            setFormData(
                                              (prev) => ({
                                                ...prev,
                                                investorAllocations:
                                                  newAllocations,
                                              }),
                                            );
                                          }}
                                          className="h-8 text-sm"
                                          onClick={(e) =>
                                            e.stopPropagation()
                                          }
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label
                                          htmlFor={`share-${investor.id}`}
                                          className="text-xs"
                                        >
                                          Ownership Share (%)*
                                        </Label>
                                        <Input
                                          id={`share-${investor.id}`}
                                          type="number"
                                          placeholder="0"
                                          min="0"
                                          max="100"
                                          step="0.01"
                                          value={
                                            allocation.ownershipShare ||
                                            ""
                                          }
                                          onChange={(e) => {
                                            const newAllocations =
                                              {
                                                ...formData.investorAllocations,
                                              };
                                            newAllocations[
                                              investor.id
                                            ] = {
                                              ...newAllocations[
                                                investor.id
                                              ],
                                              ownershipShare:
                                                e.target.value,
                                            };
                                            setFormData(
                                              (prev) => ({
                                                ...prev,
                                                investorAllocations:
                                                  newAllocations,
                                              }),
                                            );
                                          }}
                                          className="h-8 text-sm"
                                          onClick={(e) =>
                                            e.stopPropagation()
                                          }
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {formData.assignedInvestors.length >
                        0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                          <p className="text-sm font-medium text-green-900">
                            {formData.assignedInvestors.length}{" "}
                            investor(s) selected
                          </p>
                          <div className="text-xs space-y-1">
                            {formData.assignedInvestors.map(
                              (id) => {
                                const investor = investors.find(
                                  (inv) => inv.id === id,
                                );
                                const allocation =
                                  formData.investorAllocations[
                                    id
                                  ];
                                return (
                                  <div
                                    key={id}
                                    className="flex justify-between"
                                  >
                                    <span>
                                      {investor?.name}:
                                    </span>
                                    <span>
                                      PKR{" "}
                                      {allocation?.investmentAmount ||
                                        "0"}{" "}
                                      (
                                      {allocation?.ownershipShare ||
                                        "0"}
                                      %)
                                    </span>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Listing Type Section - REQUIRED FIRST */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Listing Type</CardTitle>
                <p className="text-sm text-gray-600">
                  Select the type of property listing
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="listingType">
                    Listing Type{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.listingType}
                    onValueChange={(value) =>
                      handleInputChange("listingType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="for-sale">
                        For Sale
                      </SelectItem>
                      <SelectItem value="for-rent">
                        For Rent
                      </SelectItem>
                      <SelectItem value="wanted">
                        Wanted to Buy
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600 mt-1">
                    {formData.listingType === "for-sale" &&
                      "Property available for purchase"}
                    {formData.listingType === "for-rent" &&
                      "Property available for lease/rental"}
                    {formData.listingType === "wanted" &&
                      "Buyer requirement - Looking to purchase a property with these specifications"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Property Details Section */}
            <div className="space-y-2">
              <Label htmlFor="title">Property Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  handleInputChange("title", e.target.value)
                }
                placeholder="e.g., Modern Family Home"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address*</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  handleInputChange("address", e.target.value)
                }
                placeholder="e.g., Plot 123, DHA Phase 5, Karachi"
                required
              />
            </div>

            {/* Conditional Financial Fields Based on Listing Type */}
            {formData.listingType === "for-sale" ||
            formData.listingType === "wanted" ? (
              <div className="space-y-2">
                <Label htmlFor="price">Sale Price (PKR)*</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", e.target.value)
                  }
                  placeholder="0"
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
                  Enter the{" "}
                  {formData.listingType === "for-sale"
                    ? "asking"
                    : "target"}{" "}
                  price in Pakistani Rupees
                </p>
              </div>
            ) : formData.listingType === "for-rent" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRent">
                      Monthly Rent (PKR)*
                    </Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) =>
                        handleInputChange(
                          "monthlyRent",
                          e.target.value,
                        )
                      }
                      placeholder="0"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Monthly rental amount
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityDeposit">
                      Security Deposit (PKR)
                    </Label>
                    <Input
                      id="securityDeposit"
                      type="number"
                      value={formData.securityDeposit}
                      onChange={(e) =>
                        handleInputChange(
                          "securityDeposit",
                          e.target.value,
                        )
                      }
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Refundable security deposit (typically 2-3 months rent)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leaseDuration">
                      Minimum Lease Duration (Months)
                    </Label>
                    <Input
                      id="leaseDuration"
                      type="number"
                      value={formData.leaseDuration}
                      onChange={(e) =>
                        handleInputChange(
                          "leaseDuration",
                          e.target.value,
                        )
                      }
                      placeholder="11"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Minimum lease period (default: 11 months)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="advanceRentMonths">
                      Advance Rent (Months)
                    </Label>
                    <Input
                      id="advanceRentMonths"
                      type="number"
                      value={formData.advanceRentMonths}
                      onChange={(e) =>
                        handleInputChange(
                          "advanceRentMonths",
                          e.target.value,
                        )
                      }
                      placeholder="1"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Number of months rent required upfront
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maintenanceFee">
                      Maintenance Fee (PKR/Month)
                    </Label>
                    <Input
                      id="maintenanceFee"
                      type="number"
                      value={formData.maintenanceFee}
                      onChange={(e) =>
                        handleInputChange(
                          "maintenanceFee",
                          e.target.value,
                        )
                      }
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Monthly maintenance/service charges
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availabilityDate">
                      Available From
                    </Label>
                    <Input
                      id="availabilityDate"
                      type="date"
                      value={formData.availabilityDate}
                      onChange={(e) =>
                        handleInputChange(
                          "availabilityDate",
                          e.target.value,
                        )
                      }
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Date when property becomes available
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyType">
                  Property Type*
                </Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) =>
                    handleInputChange("propertyType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">
                      Apartment
                    </SelectItem>
                    <SelectItem value="commercial">
                      Commercial
                    </SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area (sq yd)*</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) =>
                    handleInputChange("area", e.target.value)
                  }
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionRate">
                  Commission Rate (%)*
                </Label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.1"
                  value={formData.commissionRate}
                  onChange={(e) =>
                    handleInputChange(
                      "commissionRate",
                      e.target.value,
                    )
                  }
                  placeholder="2.0"
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
                  {formData.listingType === "for-rent"
                    ? "Typically 1 month rent"
                    : "Typically 2% of sale price"}
                </p>
              </div>
            </div>

            {(formData.propertyType === "house" ||
              formData.propertyType === "apartment") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      handleInputChange(
                        "bedrooms",
                        e.target.value,
                      )
                    }
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      handleInputChange(
                        "bathrooms",
                        e.target.value,
                      )
                    }
                    placeholder="0"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange(
                    "description",
                    e.target.value,
                  )
                }
                placeholder="Describe the property features, amenities, and highlights..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commissionRate">
                Commission Rate (%)
              </Label>
              <Input
                id="commissionRate"
                type="number"
                step="0.1"
                value={formData.commissionRate}
                onChange={(e) =>
                  handleInputChange(
                    "commissionRate",
                    e.target.value,
                  )
                }
                placeholder="3.0"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Property Images</Label>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleImageRemove(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleImageAdd}
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-sm">Add Image</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium">
                Publishing Settings
              </h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">
                    Publish Listing
                  </Label>
                  <p className="text-sm text-gray-500">
                    Make this listing visible to clients
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) =>
                    handleInputChange("isPublished", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous">
                    Post Anonymously
                  </Label>
                  <p className="text-sm text-gray-500">
                    Hide agent information from public view
                  </p>
                </div>
                <Switch
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) =>
                    handleInputChange("isAnonymous", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">
                    Featured Listing
                  </Label>
                  <p className="text-sm text-gray-500">
                    Highlight this property as a featured listing
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    handleInputChange("isFeatured", checked)
                  }
                />
              </div>

              {formData.isFeatured && (
                <div>
                  <Label htmlFor="featuredUntil">
                    Featured Until (Optional)
                  </Label>
                  <Input
                    id="featuredUntil"
                    type="date"
                    value={formData.featuredUntil}
                    onChange={(e) =>
                      handleInputChange("featuredUntil", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for no expiry
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="expiryDate">
                  Listing Expiry Date (Optional)
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Property will be auto-archived after this date
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                Property Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Title</p>
                  <p className="font-medium">
                    {formData.title}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    Listing Type
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {formData.listingType === "for-sale"
                        ? "For Sale"
                        : formData.listingType === "for-rent"
                          ? "For Rent"
                          : "Wanted to Buy"}
                    </Badge>
                    <Badge variant="outline">
                      {formData.propertyType}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    Address
                  </p>
                  <p className="font-medium">
                    {formData.address}
                  </p>
                </div>

                {/* Conditional Financial Display */}
                {formData.listingType === "for-sale" ||
                formData.listingType === "wanted" ? (
                  <div>
                    <p className="text-sm text-gray-600">
                      Sale Price
                    </p>
                    <p className="font-medium">
                      PKR{" "}
                      {parseFloat(
                        formData.price || "0",
                      ).toLocaleString()}
                    </p>
                  </div>
                ) : formData.listingType === "for-rent" ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">
                        Monthly Rent
                      </p>
                      <p className="font-medium">
                        PKR{" "}
                        {parseFloat(
                          formData.monthlyRent || "0",
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Security Deposit
                      </p>
                      <p className="font-medium">
                        PKR{" "}
                        {parseFloat(
                          formData.securityDeposit || "0",
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Lease Duration
                      </p>
                      <p className="font-medium">
                        {formData.leaseDuration || "12"} months
                      </p>
                    </div>
                  </>
                ) : null}

                <div>
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="font-medium">
                    {formData.area} sq ft
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    Commission Rate
                  </p>
                  <p className="font-medium">
                    {formData.commissionRate}%
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Description
                </p>
                <p className="mt-1">{formData.description}</p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Images ({formData.images.length})
                </p>
                <div className="flex gap-2">
                  {formData.images
                    .slice(0, 3)
                    .map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  {formData.images.length > 3 && (
                    <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center text-sm text-gray-600">
                      +{formData.images.length - 3}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Published:
                  </span>
                  <Badge
                    variant={
                      formData.isPublished
                        ? "default"
                        : "secondary"
                    }
                  >
                    {formData.isPublished ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Anonymous:
                  </span>
                  <Badge
                    variant={
                      formData.isAnonymous
                        ? "default"
                        : "secondary"
                    }
                  >
                    {formData.isAnonymous ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        // Enhanced validation for step 0
        const hasOwner =
          formData.currentOwnerId &&
          formData.currentOwnerId.trim() !== "";
        const hasTitle =
          formData.title && formData.title.trim().length >= 3;
        const hasAddress =
          formData.address &&
          formData.address.trim().length >= 5;
        const hasValidArea =
          formData.area && parseFloat(formData.area) > 0;
        const hasDescription =
          formData.description &&
          formData.description.trim().length >= 10;
        const hasListingType =
          formData.listingType &&
          formData.listingType.trim() !== "";
        const hasPropertyType =
          formData.propertyType &&
          formData.propertyType.trim() !== "";

        // Conditional financial validation based on listing type
        let hasValidFinancials = false;
        if (
          formData.listingType === "for-sale" ||
          formData.listingType === "wanted"
        ) {
          hasValidFinancials =
            formData.price && parseFloat(formData.price) > 0;
        } else if (formData.listingType === "for-rent") {
          hasValidFinancials =
            formData.monthlyRent &&
            parseFloat(formData.monthlyRent) > 0;
        }

        // Additional validation for purchase types
        let hasPurchaseDetails = true;
        if (acquisitionType !== "client-listing") {
          const hasPurchasePrice =
            formData.purchasePrice &&
            parseFloat(formData.purchasePrice) > 0;
          const hasPaymentSource =
            formData.paymentSource &&
            formData.paymentSource.trim() !== "";
          hasPurchaseDetails =
            hasPurchasePrice && hasPaymentSource;

          // Investor-purchase specific validation
          if (acquisitionType === "investor-purchase") {
            const hasInvestors =
              formData.assignedInvestors.length > 0;
            const allInvestorsHaveAllocations =
              formData.assignedInvestors.every((id) => {
                const allocation =
                  formData.investorAllocations[id];
                return (
                  allocation &&
                  allocation.investmentAmount &&
                  parseFloat(allocation.investmentAmount) > 0 &&
                  allocation.ownershipShare &&
                  parseFloat(allocation.ownershipShare) > 0
                );
              });
            hasPurchaseDetails =
              hasPurchaseDetails &&
              hasInvestors &&
              allInvestorsHaveAllocations;
          }
        }

        return (
          hasOwner &&
          hasTitle &&
          hasAddress &&
          hasValidFinancials &&
          hasValidArea &&
          hasDescription &&
          hasListingType &&
          hasPropertyType &&
          hasPurchaseDetails
        );
      case 1:
        return formData.images.length > 0;
      case 2:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Property" : "Add New Property"}
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? "Update property information"
              : "Create a new property listing"}
          </p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    index <= currentStep
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 w-8 h-0.5 ${
                      index < currentStep
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentStep(Math.max(0, currentStep - 1))
              }
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
              >
                Create Property
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Contact Modal */}
      <QuickAddContactModal
        open={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onContactAdded={handleContactAdded}
        user={user}
      />
    </div>
  );
};