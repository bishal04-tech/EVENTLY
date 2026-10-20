// backend/tests/run-all-tests.js

const BASE_URL = process.env.API_URL || 'http://localhost:5000';

async function runTestSuite() {
  console.log('\n========================================');
  console.log('🚀 STARTING EVENTLY API FULL TEST SUITE');
  console.log(`Target Server: ${BASE_URL}`);
  console.log('========================================\n');

  let organizerToken = '';
  let attackerToken = '';
  let testEventId = '';
  let categoryId = 1;

  const organizer = {
    username: `organizer_${Date.now()}`,
    email: `organizer_${Date.now()}@test.com`,
    password: 'password123',
  };

  const attacker = {
    username: `attacker_${Date.now()}`,
    email: `attacker_${Date.now()}@test.com`,
    password: 'password123',
  };

  // ----------------------------------------------------
  // TEST 1: Authentication & Rate Limiting Edge Cases
  // ----------------------------------------------------
  console.log('▶ [Test 1a] Registering primary Organizer...');
  try {
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(organizer),
    });
    const regData = await regRes.json();
    if (regRes.ok && regData.token) {
      organizerToken = regData.token;
      console.log('✅ Organizer registered and JWT received.');
    } else {
      throw new Error(regData.message || 'Registration failed');
    }
  } catch (err) {
    console.error('❌ Test 1a Failed:', err.message);
    process.exit(1);
  }

  console.log('\n▶ [Test 1b] Testing Duplicate Registration (Edge Case)...');
  const dupRegRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(organizer),
  });
  if (dupRegRes.status === 400) {
    console.log('✅ Duplicate registration correctly rejected (400).');
  } else {
    console.error(`❌ Duplicate registration check failed (Got ${dupRegRes.status}).`);
  }

  console.log('\n▶ [Test 1c] Testing Invalid Login (Edge Case)...');
  const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: organizer.username, password: 'wrongpassword' }),
  });
  if (badLoginRes.status === 401) {
    console.log('✅ Invalid credentials correctly rejected (401).');
  } else {
    console.error(`❌ Invalid login check failed (Got ${badLoginRes.status}).`);
  }

  console.log('\n▶ [Test 1d] Registering second user (Attacker)...');
  const attackerRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attacker),
  });
  const attackerData = await attackerRes.json();
  attackerToken = attackerData.token;
  console.log('✅ Attacker registered and JWT received.');

  // ----------------------------------------------------
  // TEST 2: Fetch Categories
  // ----------------------------------------------------
  console.log('\n▶ [Test 2] Fetching Categories...');
  const catRes = await fetch(`${BASE_URL}/api/categories`);
  if (catRes.ok) {
    const categories = await catRes.json();
    if (categories.length > 0) {
      categoryId = categories[0].categoryId;
      console.log(`✅ Loaded categories. Using categoryId: ${categoryId}`);
    }
  }

  // ----------------------------------------------------
  // TEST 3: Create an Event
  // ----------------------------------------------------
  console.log('\n▶ [Test 3] Creating Event with capacity = 5 seats...');
  const newEventPayload = {
    title: `Full Coverage Test Event ${Date.now()}`,
    location: 'Mumbai Expo Center',
    startDate: new Date(Date.now() + 86400000).toISOString(),
    categoryId: categoryId,
    price: '50.00',
    isFree: false,
    totalSeats: 5,
    availableSeats: 5,
  };

  const createEventRes = await fetch(`${BASE_URL}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${organizerToken}`,
    },
    body: JSON.stringify(newEventPayload),
  });

  const createdEvent = await createEventRes.json();
  if (!createEventRes.ok) {
    console.error('❌ Test 3 Failed to create event:', createdEvent);
    process.exit(1);
  }

  testEventId = createdEvent.id || createdEvent._id;
  console.log(`✅ Event created successfully. ID: ${testEventId}`);

  // ----------------------------------------------------
  // TEST 4: Resource Ownership & Authorization Edge Cases
  // ----------------------------------------------------
  console.log('\n▶ [Test 4a] Attacker attempts to UPDATE organizer\'s event...');
  const unauthorizedUpdateRes = await fetch(`${BASE_URL}/api/events/${testEventId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${attackerToken}`,
    },
    body: JSON.stringify({ title: 'Hacked Title' }),
  });
  if (unauthorizedUpdateRes.status === 403) {
    console.log('✅ Unauthorized update correctly blocked (403 Forbidden).');
  } else {
    console.error(`❌ Ownership check failed on update! (Got ${unauthorizedUpdateRes.status})`);
  }

  console.log('\n▶ [Test 4b] Organizer UPDATE their own event (Happy Path)...');
  const validUpdateRes = await fetch(`${BASE_URL}/api/events/${testEventId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${organizerToken}`,
    },
    body: JSON.stringify({ price: '45.00' }),
  });
  if (validUpdateRes.status === 200) {
    console.log('✅ Organizer successfully updated their event.');
  } else {
    console.error(`❌ Organizer update failed! (Got ${validUpdateRes.status})`);
  }

  // ----------------------------------------------------
  // TEST 5: Order Edge Cases
  // ----------------------------------------------------
  console.log('\n▶ [Test 5a] Attempting to book 0 tickets (Edge Case)...');
  const invalidQtyRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventId: testEventId,
      buyerName: 'Test Buyer',
      buyerEmail: 'test@test.com',
      quantity: 0,
      totalAmount: '0.00',
    }),
  });
  if (invalidQtyRes.status === 400) {
    console.log('✅ Invalid quantity (0) correctly rejected (400).');
  } else {
    console.error(`❌ Invalid quantity check failed (Got ${invalidQtyRes.status})`);
  }

  // ----------------------------------------------------
  // TEST 6: CONCURRENCY RACE CONDITION TEST
  // ----------------------------------------------------
  console.log('\n▶ [Test 6] FIRING 10 SIMULTANEOUS BOOKING REQUESTS FOR 5 SEATS...');
  const bookingRequests = Array.from({ length: 10 }, (_, index) => {
    const userNum = index + 1;
    return fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: testEventId,
        buyerName: `Simultaneous Buyer ${userNum}`,
        buyerEmail: `buyer${userNum}@test.com`,
        quantity: 1,
        totalAmount: '45.00',
      }),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      return {
        user: `User ${userNum}`,
        statusCode: res.status,
        result: res.status === 201 ? 'SUCCESS (Booked)' : 'REJECTED (Sold Out)',
        response: data.error || 'Order Placed',
      };
    });
  });

  const results = await Promise.all(bookingRequests);
  console.table(results);

  const successfulBookings = results.filter((r) => r.statusCode === 201).length;
  const rejectedBookings = results.filter((r) => r.statusCode === 409).length;

  if (successfulBookings === 5 && rejectedBookings === 5) {
    console.log('✅ CONCURRENCY TEST PASSED! Exactly 5 seats booked, no overselling.');
  } else {
    console.error(`❌ CONCURRENCY TEST FAILED! Got ${successfulBookings} successful bookings.`);
  }

  // ----------------------------------------------------
  // TEST 7: Dashboard Stats & Metrics
  // ----------------------------------------------------
  console.log('\n▶ [Test 7a] Fetching Dashboard Statistics...');
  const statsRes = await fetch(`${BASE_URL}/api/stats/dashboard`);
  if (statsRes.status === 200) {
    console.log('✅ Dashboard stats fetched successfully.');
  } else {
    console.error(`❌ Dashboard stats failed (Got ${statsRes.status})`);
  }

  console.log('\n▶ [Test 7b] Fetching System Metrics...');
  const metricsRes = await fetch(`${BASE_URL}/api/metrics`);
  if (metricsRes.status === 200) {
    console.log('✅ Live API metrics fetched successfully.');
  } else {
    console.error(`❌ Metrics failed (Got ${metricsRes.status})`);
  }

  // ----------------------------------------------------
  // TEST 8: Cleanup & Deletion Edge Cases
  // ----------------------------------------------------
  console.log('\n▶ [Test 8a] Attacker attempts to DELETE organizer\'s event...');
  const unauthorizedDelRes = await fetch(`${BASE_URL}/api/events/${testEventId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${attackerToken}` },
  });
  if (unauthorizedDelRes.status === 403) {
    console.log('✅ Unauthorized delete correctly blocked (403 Forbidden).');
  } else {
    console.error(`❌ Ownership check failed on delete! (Got ${unauthorizedDelRes.status})`);
  }

  console.log('\n▶ [Test 8b] Organizer DELETE their own event (Cleanup)...');
  const validDelRes = await fetch(`${BASE_URL}/api/events/${testEventId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${organizerToken}` },
  });
  if (validDelRes.status === 204) {
    console.log('✅ Event successfully deleted by Organizer.');
  } else {
    console.error(`❌ Organizer delete failed! (Got ${validDelRes.status})`);
  }

  console.log('\n▶ [Test 8c] Verify Event is gone (404)...');
  const verifyDelRes = await fetch(`${BASE_URL}/api/events/${testEventId}`);
  if (verifyDelRes.status === 404) {
    console.log('✅ Verified: Event no longer exists in database.');
  } else {
    console.error(`❌ Deletion verification failed! (Got ${verifyDelRes.status})`);
  }

  console.log('\n========================================');
  console.log('🎉 ALL EDGE CASE TESTS COMPLETED');
  console.log('========================================\n');
}

runTestSuite();