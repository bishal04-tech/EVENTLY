

// import { useState, useEffect, useCallback } from "react";
// import { useLocation, useParams } from "wouter";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { ArrowLeft, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";

// const formSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters"),
//   description: z.string().optional(),
//   imageUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
//   location: z.string().min(3, "Location is required"),
//   startDate: z.string().min(1, "Start date is required"),
//   endDate: z.string().optional(),
//   price: z.string().optional(),
//   isFree: z.boolean().default(false),
//   url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
//   categoryId: z.coerce.number().min(1, "Category is required"),
//   organizerName: z.string().optional(),
// });

// export default function EventFormPage() {
//   const { id } = useParams();
//   const isEdit = !!id;
//   const eventId = isEdit ? id : undefined; // Backend uses MongoDB string ID
  
//   const [, setLocation] = useLocation();
//   const { toast } = useToast();

//   const [categories, setCategories] = useState([]);
//   const [eventData, setEventData] = useState(null);
//   const [isLoadingEvent, setIsLoadingEvent] = useState(isEdit);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
//   const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

//   // Fetch Categories
//   useEffect(() => {
//     fetch(`${cleanBaseUrl}/api/categories`)
//       .then((res) => res.json())
//       .then((data) => setCategories(data))
//       .catch((err) => console.error("Failed to load categories:", err));
//   }, [cleanBaseUrl]);

//   // Fetch Event if Editing
//   useEffect(() => {
//     if (!isEdit) return;
    
//     setIsLoadingEvent(true);
//     fetch(`${cleanBaseUrl}/api/events/${eventId}`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Event not found");
//         return res.json();
//       })
//       .then((data) => setEventData(data))
//       .catch((err) => {
//         toast({ title: "Error", description: err.message, variant: "destructive" });
//         setLocation("/events");
//       })
//       .finally(() => setIsLoadingEvent(false));
//   }, [isEdit, eventId, cleanBaseUrl, setLocation, toast]);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       imageUrl: "",
//       location: "",
//       startDate: new Date().toISOString().slice(0, 16),
//       endDate: "",
//       price: "",
//       isFree: false,
//       url: "",
//       categoryId: undefined,
//       organizerName: "",
//     },
//   });

//   const isFree = form.watch("isFree");

//   // Populate form when event data loads
//   useEffect(() => {
//     if (isEdit && eventData) {
//       form.reset({
//         title: eventData.title || "",
//         description: eventData.description || "",
//         imageUrl: eventData.imageUrl || "",
//         location: eventData.location || "",
//         startDate: eventData.startDate ? new Date(eventData.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
//         endDate: eventData.endDate ? new Date(eventData.endDate).toISOString().slice(0, 16) : "",
//         price: eventData.price || "",
//         isFree: !!eventData.isFree,
//         url: eventData.url || "",
//         categoryId: eventData.categoryId,
//         organizerName: eventData.organizerName || "",
//       });
//     }
//   }, [isEdit, eventData, form]);

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
    
//     const formattedData = {
//       ...data,
//       startDate: new Date(data.startDate).toISOString(),
//       endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
//       price: data.isFree ? undefined : data.price,
//     };

//     try {
//       const endpoint = isEdit ? `${cleanBaseUrl}/api/events/${eventId}` : `${cleanBaseUrl}/api/events`;
//       const method = isEdit ? "PATCH" : "POST";

//       // ⚠️ UPDATE THIS LINE: Grab your auth token from wherever you store it
//       const token = localStorage.getItem("token") || ""; 

//       const response = await fetch(endpoint, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}` // Required by your backend req.user check
//         },
//         body: JSON.stringify(formattedData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to save event");
//       }

//       const savedEvent = await response.json();
      
//       toast({ title: `Event ${isEdit ? "updated" : "created"} successfully` });
//       setLocation(`/events/${savedEvent.id}`);
      
//     } catch (error) {
//       toast({ 
//         variant: "destructive", 
//         title: "Action Failed", 
//         description: error.message 
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isEdit && isLoadingEvent) {
//     return (
//       <div className="container mx-auto px-4 py-20 flex justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-muted/30 min-h-full py-12">
//       <div className="container mx-auto px-4 max-w-3xl">
//         <Button 
//           variant="ghost" 
//           onClick={() => window.history.back()} 
//           className="mb-6 -ml-4 text-muted-foreground"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" /> Back
//         </Button>
        
//         <div className="mb-8">
//           <h1 className="text-4xl font-black tracking-tight">{isEdit ? "Edit Event" : "Create a New Event"}</h1>
//           <p className="text-muted-foreground mt-2">
//             {isEdit ? "Update your event details below." : "Fill out the form below to publish your event to the world."}
//           </p>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Basic Information</CardTitle>
//                 <CardDescription>The essential details attendees need to know.</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <FormField
//                   control={form.control}
//                   name="title"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Event Title</FormLabel>
//                       <FormControl>
//                         <Input placeholder="e.g. Summer Music Festival 2026" className="text-lg py-6" {...field} data-testid="input-event-title" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <FormField
//                     control={form.control}
//                     name="categoryId"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Category</FormLabel>
//                         <Select 
//                           onValueChange={(val) => field.onChange(Number(val))} 
//                           value={field.value ? field.value.toString() : ""}
//                         >
//                           <FormControl>
//                             <SelectTrigger data-testid="select-event-category">
//                               <SelectValue placeholder="Select a category" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {categories?.map((cat) => (
//                               // We use cat.categoryId to align with your backend Event model
//                               <SelectItem key={cat.id} value={cat.categoryId?.toString() || "0"}>
//                                 {cat.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
                  
//                   <FormField
//                     control={form.control}
//                     name="organizerName"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Organizer Name</FormLabel>
//                         <FormControl>
//                           <Input placeholder="e.g. Acme Events" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
                
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Description</FormLabel>
//                       <FormControl>
//                         <Textarea 
//                           placeholder="Tell attendees what to expect..." 
//                           className="min-h-[150px] resize-y" 
//                           {...field} 
//                           data-testid="textarea-event-description"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Time & Location</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <FormField
//                   control={form.control}
//                   name="location"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Location</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Venue name or address" {...field} data-testid="input-event-location" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <FormField
//                     control={form.control}
//                     name="startDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Start Date & Time</FormLabel>
//                         <FormControl>
//                           <Input type="datetime-local" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
                  
//                   <FormField
//                     control={form.control}
//                     name="endDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>End Date & Time (Optional)</FormLabel>
//                         <FormControl>
//                           <Input type="datetime-local" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Ticketing & Media</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="flex flex-col space-y-4 p-4 border rounded-xl bg-muted/30">
//                   <FormField
//                     control={form.control}
//                     name="isFree"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-center justify-between rounded-lg">
//                         <div className="space-y-0.5">
//                           <FormLabel className="text-base font-semibold">Free Event</FormLabel>
//                           <FormDescription>
//                             Is this event free to attend?
//                           </FormDescription>
//                         </div>
//                         <FormControl>
//                           <Switch
//                             checked={field.value}
//                             onCheckedChange={field.onChange}
//                             data-testid="switch-event-free"
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
                  
//                   {!isFree && (
//                     <FormField
//                       control={form.control}
//                       name="price"
//                       render={({ field }) => (
//                         <FormItem className="animate-in fade-in zoom-in duration-200">
//                           <FormLabel>Ticket Price ($)</FormLabel>
//                           <FormControl>
//                             <Input type="number" step="0.01" min="0" placeholder="e.g. 29.99" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   )}
//                 </div>

//                 <FormField
//                   control={form.control}
//                   name="imageUrl"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Cover Image URL (Optional)</FormLabel>
//                       <FormControl>
//                         <Input placeholder="https://example.com/image.jpg" {...field} />
//                       </FormControl>
//                       <FormDescription>Provide a high-quality image URL for your event banner.</FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <FormField
//                   control={form.control}
//                   name="url"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>External Link (Optional)</FormLabel>
//                       <FormControl>
//                         <Input placeholder="https://..." {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </CardContent>
//             </Card>

//             <div className="flex justify-end gap-4">
//               <Button type="button" variant="outline" onClick={() => window.history.back()} size="lg">
//                 Cancel
//               </Button>
//               <Button type="submit" size="lg" className="min-w-40 font-bold" disabled={isSubmitting} data-testid="button-submit-event">
//                 {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//                 {isEdit ? "Update Event" : "Publish Event"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  imageFile: z.any().optional(), // Stores raw file object locally for upload
  location: z.string().min(3, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  price: z.string().optional(),
  isFree: z.boolean().default(false),
  url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  categoryId: z.coerce.number().min(1, "Category is required"),
  organizerName: z.string().optional(),
});

export default function EventFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const eventId = isEdit ? id : undefined;
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [categories, setCategories] = useState([]);
  const [eventData, setEventData] = useState(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  // Fetch Categories
  useEffect(() => {
    fetch(`${cleanBaseUrl}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories:", err));
  }, [cleanBaseUrl]);

  // Fetch Event if Editing
  useEffect(() => {
    if (!isEdit) return;
    
    setIsLoadingEvent(true);
    fetch(`${cleanBaseUrl}/api/events/${eventId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Event not found");
        return res.json();
      })
      .then((data) => {
        setEventData(data);
        if (data.imageUrl) setImagePreview(data.imageUrl); // Backend returning image string URL
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
        setLocation("/events");
      })
      .finally(() => setIsLoadingEvent(false));
  }, [isEdit, eventId, cleanBaseUrl, setLocation, toast]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageFile: null,
      location: "",
      startDate: new Date().toISOString().slice(0, 16),
      endDate: "",
      price: "",
      isFree: false,
      url: "",
      categoryId: undefined,
      organizerName: "",
    },
  });

  const isFree = form.watch("isFree");

  // Populate form when event data loads
  useEffect(() => {
    if (isEdit && eventData) {
      form.reset({
        title: eventData.title || "",
        description: eventData.description || "",
        imageFile: null,
        location: eventData.location || "",
        startDate: eventData.startDate ? new Date(eventData.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        endDate: eventData.endDate ? new Date(eventData.endDate).toISOString().slice(0, 16) : "",
        price: eventData.price || "",
        isFree: !!eventData.isFree,
        url: eventData.url || "",
        categoryId: eventData.categoryId,
        organizerName: eventData.organizerName || "",
      });
    }
  }, [isEdit, eventData, form]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Construct FormData object
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("location", data.location);
    formData.append("startDate", new Date(data.startDate).toISOString());
    formData.append("categoryId", String(data.categoryId));
    formData.append("isFree", String(data.isFree));
    
    if (data.description) formData.append("description", data.description);
    if (data.endDate) formData.append("endDate", new Date(data.endDate).toISOString());
    if (!data.isFree && data.price) formData.append("price", data.price);
    if (data.url) formData.append("url", data.url);
    if (data.organizerName) formData.append("organizerName", data.organizerName);
    
    // 🔥 MATCHES BACKEND: appends file matching upload.single('imageUrl')
    if (data.imageFile) {
      formData.append("imageUrl", data.imageFile);
    }

    try {
      const endpoint = isEdit ? `${cleanBaseUrl}/api/events/${eventId}` : `${cleanBaseUrl}/api/events`;
      const method = isEdit ? "PATCH" : "POST";
      const token = localStorage.getItem("token") || ""; 

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`
          // Keep Content-Type omitted so browser writes multi-part boundary stream headers correctly
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save event");
      }

      const savedEvent = await response.json();
      
      toast({ title: `Event ${isEdit ? "updated" : "created"} successfully` });
      setLocation(`/events/${savedEvent.id || savedEvent._id}`);
      
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Action Failed", 
        description: error.message 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && isLoadingEvent) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-full py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()} 
          className="mb-6 -ml-4 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight">{isEdit ? "Edit Event" : "Create a New Event"}</h1>
          <p className="text-muted-foreground mt-2">
            {isEdit ? "Update your event details below." : "Fill out the form below to publish your event to the world."}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>The essential details attendees need to know.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Summer Music Festival 2026" className="text-lg py-6" {...field} data-testid="input-event-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={(val) => field.onChange(Number(val))} 
                          value={field.value ? field.value.toString() : ""}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-event-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id || cat._id} value={cat.categoryId?.toString() || "0"}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="organizerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organizer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Acme Events" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell attendees what to expect..." 
                          className="min-h-[150px] resize-y" 
                          {...field} 
                          data-testid="textarea-event-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time & Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Venue name or address" {...field} data-testid="input-event-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date & Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date & Time (Optional)</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ticketing & Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col space-y-4 p-4 border rounded-xl bg-muted/30">
                  <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-semibold">Free Event</FormLabel>
                          <FormDescription>Is this event free to attend?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-event-free"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {!isFree && (
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="animate-in fade-in zoom-in duration-200">
                          <FormLabel>Ticket Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" placeholder="e.g. 29.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Cover Image Upload Area */}
                <FormField
                  control={form.control}
                  name="imageFile"
                  render={({ field: { ref, name, onBlur, onChange } }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <div className="flex flex-col gap-4 items-start">
                        {imagePreview && (
                          <div className="relative w-full h-48 overflow-hidden rounded-lg border">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <FormControl>
                          <div className="flex items-center gap-2 w-full">
                            <Input 
                              type="file" 
                              accept="image/*"
                              className="hidden"
                              id="event-image-upload"
                              ref={ref}
                              name={name}
                              onBlur={onBlur}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file); // Updates state inside react-hook-form
                                  setImagePreview(URL.createObjectURL(file)); // Assigns browser local preview string URL
                                }
                              }}
                            />
                            <label 
                              htmlFor="event-image-upload" 
                              className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 w-full cursor-pointer hover:bg-muted/50 transition"
                            >
                              <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                                <Upload className="h-5 w-5 mb-1" />
                                <span>Click to upload event graphic</span>
                              </div>
                            </label>
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>External Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => window.history.back()} size="lg">
                Cancel
              </Button>
              <Button type="submit" size="lg" className="min-w-40 font-bold" disabled={isSubmitting} data-testid="button-submit-event">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? "Update Event" : "Publish Event"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}